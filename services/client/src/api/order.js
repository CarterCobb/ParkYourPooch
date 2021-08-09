import { api } from "./helpers/network-prefix";
import axios from "axios";
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
      cb({
        error: error.response
          ? error.response.data._embedded.error
          : error.message,
      });
    }
  }

  /**
   * Get all the orders
   * @param {Function} cb callback function (orders, err)
   */
  static async getAllOrders(cb) {
    try {
      const token = ls.get("token");
      const get = await axios.get(`${api}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (get.status !== 200) {
        try {
          await User.getTokens((err) => {
            if (err) return cb(null, err);
          });
          const token2 = ls.get("token");
          const get2 = await axios.get(`${api}/poochs`, {
            headers: { Authorization: `Bearer ${token2}` },
          });
          if (get2.status !== 200) return cb(null, get2.data._embedded);
          cb(get2.data._embedded.orders, null);
        } catch (error) {
          cb(null, { error: error.message });
        }
      } else cb(get.data._embedded.orders, null);
    } catch (error) {
      cb(null, { error: error.message });
    }
  }
}
