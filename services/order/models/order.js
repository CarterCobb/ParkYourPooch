import mongoose from "mongoose";
import { NODE_ENV } from "../keys.js";
const { model, Schema } = mongoose;

/**
 * Validate using the Luhn Algorithm
 * @param {String} value card number as a string
 * @returns {boolean} if valid
 */
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

/**
 * Validates a future date
 * @param {String} expires date string MM/YY
 * @returns {boolean} if valid
 */
const valid_date = (expires) => {
  try {
    const date = new Date();
    return (
      expires &&
      /^\d{1,2}\/\d{2}$/.test(expires) &&
      parseInt(expires.split("/")[0]) >= date.getMonth() &&
      parseInt(expires.split("/")[1]) >=
        parseInt(date.getFullYear().toString().substr(2, 2))
    );
  } catch {
    return false;
  }
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
      validate: [(val) => valid_card(`${val}`), "'card_number' is invalid"],
    },
    cvv: {
      type: Number,
      required: [true, "'cvv' is a required attribute of order"],
    },
    expires: {
      type: String,
      required: [true, "'expires' is a required attibute of order"],
      validate: [valid_date, "'expires' is invalid"],
      maxLength: [5, "'expires' cannot exceed five characters"],
      minLength: [5, "'expires' cannot contain less than five characters"],
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
