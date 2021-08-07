import { api } from "./helpers/network-prefix";
import axios from "axios";
import User from "./user";
import { ls } from "./user";

export default class Customer {
  /**
   * Register a customer
   * @param {Object} payload customer object
   * @param {Function} cb callback function (err)
   */
  static async register(payload, cb) {
    try {
      const post = await axios.post(
        `${api}/customer`,
        JSON.stringify(payload),
        { headers: { "Content-Type": "application/json" } }
      );
      if (post.status !== 201) cb(post.data._embedded);
      cb(null);
    } catch (error) {
      cb({ error: error.message });
    }
  }

  /**
   * Adds a pooch to the customer object
   * @param {String} pooch pooch id
   * @param {Function} cb callback function (user, err)
   * @returns
   */
  static async addPooch(pooch, cb) {
    try {
      const token = ls.get("token");
      const put = await axios.put(
        `${api}/customer/pooch/${pooch}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!put.data._embedded.customer) {
        try {
          await User.getTokens((err) => {
            if (err) return cb(null, err);
          });
          const token2 = ls.get("token");
          const put2 = await axios.put(
            `${api}/customer/pooch/${pooch}`,
            {},
            { headers: { Authorization: `Bearer ${token2}` } }
          );
          if (!put2.data._embedded.user) return cb(null, put2.data._embedded);
          cb(put2.data._embedded.customer, null);
        } catch (error) {
          cb(null, { error: error.message });
        }
      }
      cb(put.data._embedded.customer, null);
    } catch (error) {
      cb(null, { error: error.message });
    }
  }
}
