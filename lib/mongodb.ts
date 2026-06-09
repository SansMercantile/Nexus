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

/**
 * Scoped database query helper to enforce multi-tenancy and RBAC.
 * @param collectionName - The name of the MongoDB collection.
 * @param filter - The base filter for the query.
 * @param context - The current user's context (tenantId, userId, role).
 */
export async function getScopedData(
  collectionName: string,
  filter: Record<string, any>,
  context: { tenantId?: string; userId?: string; role?: string }
) {
  const db = await getDb();
  const collection = db.collection(collectionName);

  let scopedFilter = { ...filter };

  // Admin bypass
  if (context.role === 'admin') {
    return await collection.find(scopedFilter).toArray();
  }

  // Tenant isolation: Users/Partners only see data for their organization
  if (context.tenantId) {
    scopedFilter.tenantId = context.tenantId;
  }

  // Candidate isolation: Candidates only see their own profile/applications
  if (context.userId && context.role === 'candidate') {
    // If the query is for a specific document by ID, ensure it belongs to them
    if (filter._id || filter.id) {
      scopedFilter.userId = context.userId;
    } else {
      // Otherwise, append userId to the general filter
      scopedFilter.userId = context.userId;
    }
  }

  return await collection.find(scopedFilter).toArray();
}
