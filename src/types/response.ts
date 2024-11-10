import type { ErrorMessage } from '~/utils/error';

export type GenericResponse<TData = unknown, TError = unknown> =
	| {
		status: 'success';
		data: TData;
	}
	| {
		status: 'error';
		message: ErrorMessage;
		code?: number;
		stack?: string | string[];
		data?: TError;
	};
