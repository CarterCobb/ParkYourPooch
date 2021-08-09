import { api } from "./helpers/network-prefix";
import axios from "axios";
import Customer from "./customer";
import User from "./user";
import { ls } from "./user";

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
   * Get all the pooches
   * @param {Function} cb callback function (pooches, err)
   */
  static async getAllPooches(cb) {
    try {
      const token = ls.get("token");
      const get = await axios.get(`${api}/poochs`, {
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
          cb(get2.data._embedded.pooches, null);
        } catch (error) {
          cb(null, { error: error.message });
        }
      } else cb(get.data._embedded.pooches, null);
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

  /**
   * Removes a pooch from the database and the customer object
   * @param {String} id pooch id to remove
   * @param {Function} cb callback function (user, err)
   */
  static async deletePoochById(id, cb) {
    try {
      const token = ls.get("token");
      const del = await axios.delete(`${api}/pooch/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (del.status !== 204) {
        try {
          await User.getTokens((err) => {
            if (err) return cb(null, err);
          });
          const token2 = ls.get("token");
          const del2 = await axios.delete(`${api}/pooch/${id}`, {
            headers: { Authorization: `Bearer ${token2}` },
          });
          if (del2.status !== 204) return cb(null, del2.data._embedded);
          await Customer.removePooch(id, (user, err) => {
            return cb(user, err);
          });
        } catch (error) {
          cb(null, { error: error.message });
        }
      }
      await Customer.removePooch(id, (user, err) => {
        return cb(user, err);
      });
    } catch (error) {
      cb(null, { error: error.message });
    }
  }

  /**
   * Update a pooch
   * @param {String} id pooch id
   * @param {Object} payload items to update on pooch
   * @param {Function} cb callback function (user, err)
   * @returns
   */
  static async updatePoochById(id, payload, cb) {
    try {
      const token = ls.get("token");
      const patch = await axios.patch(
        `${api}/pooch/${id}`,
        JSON.stringify(payload),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (patch.status !== 200) {
        try {
          await User.getTokens((err) => {
            if (err) return cb(null, err);
          });
          const token2 = ls.get("token");
          const patch2 = await axios.patch(
            `${api}/pooch/${id}`,
            JSON.stringify(payload),
            {
              headers: {
                Authorization: `Bearer ${token2}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (patch2.status !== 204) return cb(null, patch2.data._embedded);
          await User.getUser((user, err) => {
            return cb(user, err);
          });
        } catch (error) {
          cb(null, { error: error.message });
        }
      }
      await User.getUser((user, err) => {
        return cb(user, err);
      });
    } catch (error) {
      cb(null, { error: error.message });
    }
  }
}
