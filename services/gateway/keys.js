import dotenv from "dotenv";
const { config } = dotenv;
config();
// Node
export const NODE_ENV = process.env.NODE_ENV;
// JWT
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;