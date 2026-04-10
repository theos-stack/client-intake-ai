import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as typeof globalThis & {
    mongoose?: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}).mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
            console.log("MongoDB connected");
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error("MongoDB connection error:", error);
        throw error;
    }
}