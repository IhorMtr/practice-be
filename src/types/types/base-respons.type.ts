export type BaseResponse<T> = {
  data: T | null;
  success: boolean;
  errors?: Record<string, string[]> | null;
  message: string | null;
};
