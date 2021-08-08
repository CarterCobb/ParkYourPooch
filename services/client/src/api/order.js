import { api } from "./helpers/network-prefix";
import axios from "axios";
import Customer from "./customer";
import User from "./user";
import { ls } from "./user";

export default class Order {
  /**
   * Create an order
   * @param {Object} payload
   * @param {Function} cb (err)
   */
  static async createOrder(payload, cb) {
    try {
      const post = await axios.post(`${api}/order`, JSON.stringify(payload), {
        headers: { "Content-Type": "application/json" },
      });
      if (post.status !== 201) return cb(post.data._embedded);
      cb(null);
    } catch (error) {
      cb({ error: error.response ? error.response.data._embedded.error : error.message });
    }
  }
}
