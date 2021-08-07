import { api } from "./helpers/network-prefix";
import axios from "axios";
import Customer from "./customer";

export default class Pooch {
  /**
   * Creates a pooch
   * @param {Object} pooch pooch to create
   * @param {Function} cb callback function (user, err)
   */
  static async createPooch(pooch, cb) {
    try {
      const post = await axios.post(`${api}/pooch`, JSON.stringify(pooch), {
        headers: { "Content-Type": "application/json" },
      });
      if (post.status !== 200) return cb(null, post.data._embedded);
      await Customer.addPooch(post.data._embedded.pooch._id, (user, err) => {
        return cb(user, err);
      });
    } catch (error) {
      cb(null, { error: error.message });
    }
  }

  /**
   * Get a pooch by its id
   * @param {String} id
   * @returns {Object} pooch
   */
  static async getPoochById(id) {
    try {
      const get = await axios.get(`${api}/pooch/${id}`);
      if (get.status !== 200) return null;
      return get.data._embedded.pooch;
    } catch (_e) {
      return null;
    }
  }
}
