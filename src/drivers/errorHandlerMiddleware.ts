import { type ApiThrowErrors } from '../helpers/apiThrowErrors';

export const errorHandlerMiddleware = (
  error: Error & Partial<ApiThrowErrors>
): { message: string, statusCode: number } => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode != null ? error.message : 'Erro interno de servidor';
  return {
    message,
    statusCode
  };
};
