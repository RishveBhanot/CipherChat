import dotenv from 'dotenv'; 
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true,
}));

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
    connectDB();
});