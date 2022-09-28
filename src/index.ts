import databaseSetup from './database/setup.ts';
import start from './api/start.ts';

await databaseSetup();
await start();
