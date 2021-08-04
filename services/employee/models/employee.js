import mongoose from "mongoose";
import { NODE_ENV } from "../keys.js";
const { model, Schema } = mongoose;

const EmployeeSchema = new Schema({
  ...(NODE_ENV === "test" ? { _id: Number } : {}),
  name: {
    type: String,
    index: true,
    required: [true, "'name' is a required attribute of employee"],
  },
  password: {
    type: String,
    required: [true, "'password' is a required attribute of employee"],
  },
  role: {
    type: String,
    emun: ["EMPLOYEE"],
    required: [true, "'role' is a required attribute of employee"],
    default: "EMPLOYEE",
  },
});

export default model("EMPLOYEE", EmployeeSchema);
