// file: stream.js
import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

// upsert in stream 
export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUsers([userData]);
        console.log(" Stream user upserted:", userData.id);
    } catch (err) {
        console.error(" Stream upsert failed:", err);
    }
};

// Delete user in Stream
export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUsers([userId]);
        console.log(" Stream user deleted:", userId);
    } catch (err) {
        console.error(" Stream delete failed:", err);
    }
};