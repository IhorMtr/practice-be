import dotenv from 'dotenv';

dotenv.config();

export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];

  if (value !== undefined && value !== '') {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Missing: process.env['${name}'].`);
}
