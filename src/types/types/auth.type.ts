export type RegisterBody = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type AuthCookies = {
  sessionId?: string;
  refreshToken?: string;
};
