import type { TokenHeader } from 'hono/utils/jwt/jwt';
import type { JWTPayload as JWTDefaultPayload } from 'hono/utils/jwt/types';
import { addHours } from 'date-fns';
import { sign } from 'hono/jwt';
import { AlgorithmTypes } from 'hono/utils/jwt/jwa';
import { verifying } from 'hono/utils/jwt/jws';
import { nanoid } from 'nanoid';
import env from '~/config/env';
import { redis } from '~/config/redis';
import { decodeBase64Url } from '~/utils/encode';
import { ERROR_MESSAGES } from '~/utils/error';
import { HttpException } from '~/utils/exception';
import { HTTP_STATUS_CODE } from '~/utils/http-status-codes';

export type JwtPayload = JWTDefaultPayload & {
	jti?: string;
	iss?: string;
	sub: string;
	aud?: string;
};

export const generateToken = async (payload: JwtPayload) => {
	const now = Math.round(Date.now() / 1000);
	const exp = Math.round(addHours(new Date(), 2).getTime() / 1000);
	const jti = nanoid();
	const token = await sign(
		{
			...payload,
			aud: env.JWT_AUDIENCE,
			exp,
			iat: now,
			iss: env.JWT_ISSUER,
			jti,
			nbf: now,
		},
		env.JWT_SECRET,
		'HS256',
	);
	redis.set(jti, token);

	return token;
};
const decodeJwtPart = (part: string): TokenHeader | JwtPayload | undefined =>
	JSON.parse(new TextDecoder().decode(decodeBase64Url(part)));

export const decode = (
	token: string,
): { header: TokenHeader; payload: JwtPayload } => {
	try {
		const [h, p] = token.split('.');
		const header = decodeJwtPart(h) as TokenHeader;
		const payload = decodeJwtPart(p) as JwtPayload;
		return {
			header,
			payload,
		};
	}
	catch {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.INVALID,
		);
	}
};
export const getTokenPayload = (token: string) => {
	return decode(token).payload as JwtPayload;
};
export function isTokenHeader(obj: unknown): obj is TokenHeader {
	if (typeof obj === 'object' && obj !== null) {
		const objWithAlg = obj as { [key: string]: unknown };
		return (
			'alg' in objWithAlg
			&& Object.values(AlgorithmTypes).includes(
				objWithAlg.alg as AlgorithmTypes,
			)
			&& (!('typ' in objWithAlg) || objWithAlg.typ === 'JWT')
		);
	}
	return false;
}

export const revokeToken = async (jti?: string) => {
	if (jti)
		await redis.del(jti);
};

export const isTokenRevoked = async (token: string) => {
	const jti = getTokenPayload(token).jti;
	if (!jti)
		return true;

	const isExist = await redis.get(jti);
	return !isExist;
};
export const verifyToken = async (token: string) => {
	const tokenParts = token.split('.');
	const publicKey = env.JWT_SECRET;
	const alg = 'HS256';

	if (tokenParts.length !== 3) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.INVALID,
		);
	}

	const { header, payload } = decode(token);
	if (!isTokenHeader(header)) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.HEADER_INVALID,
		);
	}

	const isRevoked = await isTokenRevoked(token);
	if (isRevoked) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.EXPIRED,
		);
	}

	const now = (Date.now() / 1000) | 0;
	if (payload.nbf && payload.nbf > now) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.NOT_BEFORE,
		);
	}
	if (payload.exp && payload.exp <= now) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.EXPIRED,
		);
	}
	if (payload.iat && now < payload.iat) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.ISSUED_AT,
		);
	}

	if (payload.iss && payload.iss !== env.JWT_ISSUER) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.INVALID,
		);
	}

	if (payload.aud && payload.aud !== env.JWT_AUDIENCE) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.AUDIENCE_INVALID,
		);
	}

	const headerPayload = token.substring(0, token.lastIndexOf('.'));
	const verified = await verifying(
		publicKey,
		alg,
		decodeBase64Url(tokenParts[2]),
		new TextEncoder().encode(headerPayload),
	);
	if (!verified) {
		throw new HttpException(
			HTTP_STATUS_CODE.UNAUTHORIZED,
			ERROR_MESSAGES.TOKEN.SIGNATURE_MISMATCH,
		);
	}

	return payload as JwtPayload;
};
