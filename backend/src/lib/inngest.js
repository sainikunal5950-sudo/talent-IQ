import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "talent-iq" });
const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        await connectDB();

        console.log("EVENT DATA >>>", JSON.stringify(event.data, null, 2));

        // ✅ Correct way to get primary email
        const primaryEmailId = event.data.primary_email_address_id;

        const emailObj = event.data.email_addresses?.find(
            (e) => e.id === primaryEmailId
        );

        const email = emailObj?.email_address;

        if (!email) {
            throw new Error("Email not found in Clerk event");
        }

        await User.findOneAndUpdate(
            { clerkId: event.data.id },
            {
                clerkId: event.data.id,
                email,
                name: `${event.data.first_name || ""} ${event.data.last_name || ""
                    }`.trim(),
                profileImage: event.data.image_url || "",
            },
            { upsert: true }
        );

        console.log("✅ USER SAVED:", email);
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await connectDB();
        await User.deleteOne({ clerkId: event.data.id });
    }
);

export const functions = [syncUser, deleteUserFromDB];