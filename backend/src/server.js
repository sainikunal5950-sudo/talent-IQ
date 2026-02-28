// console.log("I AM A KUNAL");

import express from "express"
// import dotenv from "dotenv"  // jo bhi secret use krna hai terko tu 
import { ENV } from "./lib/env.js";


// dotenv.config();
console.log(process.env.PORT);
console.log(process.env.DB_URL);


const app = express();
console.log(ENV.PORT);
console.log(ENV.DB_URL);

app.get("/", (req, res) => {
    res.status(200).json({ msg: "success from backend25" });
});

app.listen(3000, () => {
    console.log("server is running on a port :", ENV.PORT);
})