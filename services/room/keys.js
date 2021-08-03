import dotenv from "dotenv";
const { config } = dotenv;
config();
// Node
export const NODE_ENV = process.env.NODE_ENV;
// MongoDB
export const MONGO_URL = process.env.MONGO_URL;
