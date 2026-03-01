// console.log("I AM A KUNAL");
import { connectDB } from "./lib/db.js"
import express from "express";  // ye server lib import krle 
// import dotenv from "dotenv"  // jo bhi secret use krna hai terko tu 
import { ENV } from "./lib/env.js";  // env.js file koimport krne ka liye uska objec t 
import path from "path";   // ye path of ka pass bjta hai  directory 
import { connect } from "http2";



const app = express();    // server apllication crete ho rhi 
// Route =URL path + server ka response 
const __dirname = path.resolve();   // it return the current object path  bhai ye return krege tu backend folder ka path mai  han 

app.get("/health", (req, res) => {
    res.status(200).json({ msg: "api is runnning" });
})

app.get("/books", (req, res) => {
    res.status(200).json({ msg: "this is the book endpoint" });
});

// make your app ready for development 
// make your app ready for development 

if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/frontend/dist")));

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/frontend", "dist", "index.html"));
    });
}


// app.get("/", (req, res) => {
//     res.status(200).json({ msg: "success from backend25" });
// });

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log("server is running on port: ", ENV.PORT);
        })

    } catch (error) {
        console.log("Error starting the server", error);
    }
};


startServer();


