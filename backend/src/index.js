// import dotenv from "dotenv"
import 'dotenv/config'

import mongoose from "mongoose";
import express from "express";
import { connectDB } from "./db/connection.js";

// dotenv.config({path: './.env'})
import app from "./app.js";


const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
    app.listen(PORT, ()=>{
        console.log(`Server Started at port : ${PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB Connection Failed, Error: ", err);
})