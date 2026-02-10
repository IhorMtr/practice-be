import mongoose from 'mongoose';

import { getEnvVar } from '../utils/getEnvVar.js';

export async function initMongoConnection(): Promise<void> {
  const user = getEnvVar('MONGODB_USER');
  const pwd = getEnvVar('MONGODB_PASSWORD');
  const url = getEnvVar('MONGODB_URL');
  const db = getEnvVar('MONGODB_DB');

  try {
    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );

    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.log(`Error while connecting database ${String(err)}`);
    throw err;
  }
}
