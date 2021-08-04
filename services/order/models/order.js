import mongoose from "mongoose";
import { NODE_ENV } from "../keys.js";
const { model, Schema } = mongoose;

const valid_card = (value) => {
  if (!value || /[^0-9-\s]+/.test(value)) return false;
  var nCheck = 0,
    nDigit = 0,
    bEven = false;
  value = value.replace(/\D/g, "");
  for (var n = value.length - 1; n >= 0; n--) {
    var cDigit = value.charAt(n),
      nDigit = parseInt(cDigit, 10);
    if (bEven) if ((nDigit *= 2) > 9) nDigit -= 9;
    nCheck += nDigit;
    bEven = !bEven;
  }
  return nCheck % 10 == 0;
};

const OrderSchema = new Schema(
  {
    ...(NODE_ENV === "test" ? { _id: Number } : {}),
    name: {
      type: String,
      required: [true, "'name' is a required attribute of order"],
    },
    card_number: {
      type: Number,
      required: [true, "'card_number' is a required attribute of order"],
      validate: [valid_card, "'card_number' is invalid"],
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
