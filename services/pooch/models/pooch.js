import mongoose from "mongoose";
import { NODE_ENV } from "../keys.js";
const { model, Schema } = mongoose;

const PoochSchema = new Schema({
  ...(NODE_ENV === "test" ? { _id: Number } : {}),
  name: {
    type: String,
    required: [true, "'name' is a required attribute of pooch"],
  },
  notes: {
    type: String,
    default: "",
  },
  age: {
    type: Number,
    required: [true, "'age' is a required attribute of pooch"],
    default: 1,
  },
});

export default model("POOCH", PoochSchema);
