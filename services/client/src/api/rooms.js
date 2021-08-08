import { api } from "./helpers/network-prefix";
import axios from "axios";
import User, { ls } from "./user";

export default class Room {
  /**
   * Get all the rooms
   * @param {Function} cb (rooms, err)
   */
  static async getAll(cb) {
    try {
      const get = await axios.get(`${api}/rooms`);
      if (get.status !== 200) cb(null, get.data._embedded);
      cb(get.data._embedded.rooms, null);
    } catch (error) {
      cb({ error: error.message });
    }
  }

  /**
   * Creates a room
   * @param {Object} payload
   * @param {Function} cb callback function (err)
   */
  static async createRoom(payload, cb) {
    try {
      const post = await axios.post(`${api}/room`, JSON.stringify(payload), {
        headers: { "Content-Type": "application/json" },
      });
      if (post.status !== 200) cb(post.data._embedded);
      cb(null);
    } catch (error) {
      cb({ error: error.message });
    }
  }

  /**
   * Adds a booking to a room *call after completing order*
   * @param {String} room room id
   * @param {Object} payload booking object
   * @param {Function} cb callback function (err)
   */
  static async addBooking(room, payload, cb) {
    try {
      const token = ls.get("token");
      const put = await axios.put(
        `${api}/room/${room}/book`,
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (put.status !== 200) {
        try {
          await User.getTokens((err) => {
            if (err) return cb(err);
          });
          const token2 = ls.get("token");
          const put2 = await axios.put(
            `${api}/room/${room}/book`,
            JSON.stringify(payload),
            {
              headers: {
                Authorization: `Bearer ${token2}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (put2.status !== 200) return cb(put2.data._embedded);
          cb(null);
        } catch (error) {
          cb({ error: error.message });
        }
      }
      cb(null);
    } catch (error) {
      cb({ error: error.message });
    }
  }
}
