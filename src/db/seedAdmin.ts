import bcrypt from 'bcrypt';

import { UsersCollection } from './models/user.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export async function seedAdmin(): Promise<void> {
  const email = getEnvVar('ADMIN_EMAIL');
  const existing = await UsersCollection.findOne({ email });

  if (existing) {
    return;
  }

  const name = getEnvVar('ADMIN_NAME', 'Admin');
  const password = getEnvVar('ADMIN_PASSWORD');

  const hash = await bcrypt.hash(password, 10);

  await UsersCollection.create({
    name,
    email,
    password: hash,
    role: 'admin',
    isActive: true,
  });

  console.log(`Seed admin created: ${email}`);
}
