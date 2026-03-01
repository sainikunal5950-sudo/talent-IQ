import mongoose from "mongoose"   // monoose ek  library hai 

import { ENV } from "./env.js"  // ENV name ka object import hoo rha hai 


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log("Connected to MongoDB", conn.connection.host)
    } catch (error) {
        console.log("error connecting to MongoDB", error)
        process.exit(1);   // 0 means success 1 means pass
    }
};