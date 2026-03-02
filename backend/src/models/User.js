import mongoose from "mongoose";  // ye ek library hai 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profileImage: {
        type: String,
        default: "",
    },
    clerkId: {
        type: String,
        default: "",
        unique: true,
    },
},

    { timestamps: true }    // cretaed updateAt

)


const User = mongoose.model("User", userSchema)
export default User;