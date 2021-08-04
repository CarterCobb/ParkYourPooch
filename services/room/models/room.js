import mongoose from "mongoose";
import { NODE_ENV } from "../keys.js";
const { model, Schema } = mongoose;

/**
 * Determines if a booking time array is valid
 * @param {Array} val string array
 * @returns {Boolean} if array is greter than 2 or less than 2
 */
const arrayLimit = (val) => {
  return val.length === 2;
};

const RoomSchema = new Schema({
  ...(NODE_ENV === "test" ? { _id: Number } : {}),
  number: {
    type: String,
    required: [true, "'number' is a required attribute of room"],
  },
  bookings: {
    type: [
      {
        pooch_id: {
          type: String,
          required: [
            true,
            "'bookings[~].pooch_id' is a required attribute of room",
          ],
        },
        time: {
          type: [String],
          required: [
            true,
            "'bookings[~].time' is a required attribute of room",
          ],
          validate: [
            arrayLimit,
            "'time' array cannot exceed or contain less than 2 itmes.",
          ],
        },
      },
    ],
    required: [true, "'bookings' is a required attribute of room"],
    default: [],
  },
});

export default model("ROOM", RoomSchema);
