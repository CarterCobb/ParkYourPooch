import { api } from "./helpers/network-prefix";
import axios from "axios";
import User from "./user";

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
}
