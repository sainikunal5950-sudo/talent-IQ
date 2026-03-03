// file: functions.js
import { Inngest } from "inngest";                    // Event-driven backend
import { connectDB } from "./db.js";                  // MongoDB connection
import User from "../models/User.js";                 // MongoDB user model
import { upsertStreamUser, deleteStreamUser } from "./stream.js"; // Stream helper functions

// Inngest client setup
export const inngest = new Inngest({ id: "talent-iq" });

/**
 * 1️⃣ Sync user when created in Clerk
 */
const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        try {
            // Connect to MongoDB
            await connectDB();

            console.log("EVENT DATA >>>", JSON.stringify(event.data, null, 2));

            // Get primary email
            const primaryEmailId = event.data.primary_email_address_id;
            const emailObj = event.data.email_addresses?.find(
                (e) => e.id === primaryEmailId
            );
            const email = emailObj?.email_address;
            if (!email) throw new Error("Email not found in Clerk event");

            // Upsert user in MongoDB and return the document
            const newUser = await User.findOneAndUpdate(
                { clerkId: event.data.id },
                {
                    clerkId: event.data.id,
                    email,
                    name: `${event.data.first_name || ""} ${event.data.last_name || ""}`.trim(),
                    profileImage: event.data.image_url || "",
                },
                { upsert: true, new: true } // 'new: true' ensures returned doc
            );

            console.log(" USER SAVED IN MONGO:", email);

            // Upsert user in Stream Chat
            try {
                await upsertStreamUser({
                    id: newUser.clerkId.toString(),
                    name: newUser.name,
                    image: newUser.profileImage,
                });
                console.log(" USER CREATED IN STREAM:", newUser.clerkId);
            } catch (err) {
                console.error(" Stream user creation failed:", err);
            }

        } catch (err) {
            console.error(" syncUser failed:", err);
        }
    }
);

//  Delete user when deleted in Clerk
const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        try {
            // ye connect ho rha hai mongo db se 
            await connectDB();

            const { id } = event.data;

            // yha se mongo db se delete krdiya 
            await User.deleteOne({ clerkId: id });
            console.log("✅ USER DELETED FROM MONGO:", id);

            // delete from stream chat 
            try {
                await deleteStreamUser(id.toString());
                console.log("✅ USER DELETED FROM STREAM:", id);
            } catch (err) {
                console.error("❌ Stream user deletion failed:", err);
            }

        } catch (err) {
            console.error("❌ deleteUserFromDB failed:", err);
        }
    }
);

// yha se export krdiya function 
export const functions = [syncUser, deleteUserFromDB];