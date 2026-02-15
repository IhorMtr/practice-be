export type KnownError = {
  statusCode?: number;
  message?: string;
  errors?: Record<string, string[]>;
};
