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

  /**
   * Removes a pooch from the customer object
   * @param {String} pooch pooch id
   * @param {Function} cb callback function (user, err)
   * @returns
   */
  static async removePooch(pooch, cb) {
    try {
      const token = ls.get("token");
      const del = await axios.delete(`${api}/customer/pooch/${pooch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!del.data._embedded.customer) {
        try {
          await User.getTokens((err) => {
            if (err) return cb(null, err);
          });
          const token2 = ls.get("token");
          const del2 = await axios.delete(`${api}/customer/pooch/${pooch}`, {
            headers: { Authorization: `Bearer ${token2}` },
          });
          if (!del2.data._embedded.user) return cb(null, del2.data._embedded);
          cb(del2.data._embedded.customer, null);
        } catch (error) {
          cb(null, { error: error.message });
        }
      }
      cb(del.data._embedded.customer, null);
    } catch (error) {
      cb(null, { error: error.message });
    }
  }

  /**
   * Updates all or part of a customer
   * @param {Object} payload items to update
   * @param {Function} cb callback function (user, err)
   */
  static async updateCustomer(payload, cb) {
    try {
      const token = ls.get("token");
      const patch = await axios.patch(
        `${api}/customer`,
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
            `${api}/customer`,
            JSON.stringify(payload),
            {
              headers: {
                Authorization: `Bearer ${token2}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (patch2.status !== 204) return cb(null, patch2.data._embedded);
          cb(patch2.data._embedded.customer, null);
        } catch (error) {
          cb(null, { error: error.message });
        }
      }
      cb(patch.data._embedded.customer, null);
    } catch (error) {
      cb(null, { error: error.message });
    }
  }
}
