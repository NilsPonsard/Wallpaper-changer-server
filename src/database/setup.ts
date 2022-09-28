import { Database, PostgresConnector, Relationships } from 'https://deno.land/x/denodb@v1.0.39/mod.ts';
import { Token } from './token.ts';
import { User } from './user.ts';
import { Wallpaper } from './wallpaper.ts';

// posted for
export const PostedFor = Relationships.manyToMany(Wallpaper, User);

// posted by
Relationships.belongsTo(Wallpaper, User, { foreignKey: 'userId' });
Relationships.belongsTo(Token, User, { foreignKey: 'userId' });

const tables = [User, Wallpaper, Token, PostedFor];

// Setup database connection and schemas
export default async function setup() {
  let db: Database | null = null;

  let connected = false;
  while (!connected) {
    try {
      db = await connectDB();
      console.log('Database is connected');
      connected = true;
    } catch (err) {
      console.log(err);
      // Wait 5 seconds before trying again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  db?.link(tables);
}

// Connect to database, throw error if cant connect
async function connectDB() {
  const DB_URI = Deno.env.get('DB_URI');
  if (!DB_URI) {
    throw new Error('DB_URI is not defined');
  }

  const connector = new PostgresConnector({
    uri: DB_URI,
  });

  const db = new Database(connector);

  if (!(await db.ping())) {
    throw new Error('Database is not connected');
  }

  return db;
}
