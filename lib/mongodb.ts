import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'sansmercantile';

let clientPromise: Promise<MongoClient> | undefined;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise() {
  if (!uri) {
    throw new Error(
      'Missing MONGODB_URI environment variable. Add it to .env.local and restart the server.'
    );
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = globalThis._mongoClientPromise || client.connect();

    if (process.env.NODE_ENV !== 'production') {
      globalThis._mongoClientPromise = clientPromise;
    }
  }

  return clientPromise;
}

export async function getDb() {
  const clientInstance = await getClientPromise();
  return clientInstance.db(dbName);
}
