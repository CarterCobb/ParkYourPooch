import mongoose from "mongoose";
const { model, Schema } = mongoose;

const OrderSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "'name' is a required attribute of order"],
    },
    card_number: {
      type: Number,
      required: [true, "'card_number' is a required attribute of order"],
    },
    cvv: {
      type: Number,
      required: [true, "'cvv' is a required attribute of order"],
    },
    expires: {
      type: String,
      required: [true, "'expires' is a required attibute of order"],
    },
    total: {
      type: Number,
      required: [true, "'total' is a required attribute of order"],
      default: 0,
    },
    booking_qty: {
      type: Number,
      required: [true, "'booking_qty' is a required attribute of order"],
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("ORDER", OrderSchema);
