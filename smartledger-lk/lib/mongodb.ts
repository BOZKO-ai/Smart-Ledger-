
import mongoose, { Mongoose } from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smartledger-lk";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (!cached) {
    cached = global._mongooseCache = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export { dbConnect as connectToDatabase };
export default dbConnect;

