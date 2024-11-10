import type { ErrorMessage } from '~/utils/error';

export type GenericResponse<TData = unknown, TError = unknown> =
    | {
		status: 'success';
		data: TData;
	}
    | {
		status: 'error';
		error: {
			code: number;
			message: ErrorMessage;
			stack?: string | string[];
			details?: TError;
		};
	};