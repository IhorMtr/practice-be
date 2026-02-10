import { initMongoConnection } from './db/initMongoConnection.js';
import { seedAdmin } from './db/seedAdmin.js';
import { setupServer } from './server.js';

async function startApp() {
  try {
    await initMongoConnection();
    await seedAdmin();
    setupServer();
  } catch (err) {
    console.error('Application failed to start:', err);
    process.exit(1);
  }
}

startApp();
