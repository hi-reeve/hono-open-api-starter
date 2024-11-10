import { HTTPException } from 'hono/http-exception';
import type { StatusCode } from 'hono/utils/http-status';
import type { ErrorMessage } from '~/utils/error';

export class HttpException extends HTTPException {
    constructor(status: StatusCode, message: ErrorMessage) {
        super(status, { res: new Response(message, { status }) });
    }
}