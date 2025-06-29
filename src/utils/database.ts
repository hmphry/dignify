import { MongoClient, MongoClientOptions } from 'mongodb';

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri: string | undefined = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    // In dev, reuse global client to avoid multiple instances on hot reload
    if (!globalThis._mongoClientPromise) {
        client = new MongoClient(uri!, options);
        globalThis._mongoClientPromise = client.connect();
    }
    clientPromise = globalThis._mongoClientPromise;
} else {
    // In prod, don't reuse client
    client = new MongoClient(uri!, options);
    clientPromise = client.connect();
}

export default clientPromise;
