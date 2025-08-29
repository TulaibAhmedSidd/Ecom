import mongoose from "mongoose";

let cached = global.mongoose;
const MongoDBUri = process.env.MONGODB_URI ?? ''
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        }
        cached.promise = mongoose.connect(`${MongoDBUri}`, opts)
            .then((mongoose) => { return mongoose })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB