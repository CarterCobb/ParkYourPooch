import dotenv from "dotenv";
const { config } = dotenv;
config();
// Node
export const NODE_ENV = process.env.NODE_ENV;
// MongoDB
export const MONGO_URL = process.env.MONGO_URL;
// JWT
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
// Test Data
export const TEST_CUSTOMER = {
  _id: 12345,
  name: "test",
  email: "test@test.com",
  password: "12345",
  role: "CUSTOMER",
  pooches: [],
};
export const TEST_EMPLOYEE = {
  _id: 12345,
  name: "Billy",
  password: "12345",
  role: "EMPLOYEE",
};
