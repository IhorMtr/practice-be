export type ValidationErrorShape = {
  statusCode: number;
  message: string;
  errors: Record<string, string[]>;
};
