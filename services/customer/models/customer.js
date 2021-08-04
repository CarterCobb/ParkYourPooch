import mongoose from "mongoose";
import { NODE_ENV } from "../keys.js";
const { model, Schema } = mongoose;

const CustomerSchema = new Schema({
  ...(NODE_ENV === "test" ? { _id: Number } : {}),
  name: {
    type: String,
    required: [true, "'name' is a required attribute of customer"],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "'email' is a required attribute of customer"],
    unique: true,
    index: true,
    validate: {
      validator: (value) => {
        return Model.find({ email: value }).exec((err, users) => {
          if (err) console.log(err);
          return users.length === 0;
        });
      },
    },
  },
  password: {
    type: String,
    required: [true, "'password' is a required attribute of customer"],
  },
  role: {
    type: String,
    emun: ["CUSTOMER"],
    required: [true, "'role' is a required attribute of customer"],
    default: "CUSTOMER",
  },
  pooches: {
    type: [String],
    required: [true, "'pooches' is a required attribute of customer"],
    default: [],
  },
});

const Model = model("CUSTOMER", CustomerSchema);

export default Model;
