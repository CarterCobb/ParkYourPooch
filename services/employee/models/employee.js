import mongoose from "mongoose";
const { model, Schema } = mongoose;

const EmployeeSchema = new Schema({
  name: {
    type: String,
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
