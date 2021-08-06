import SecureLS from "secure-ls";
import axios from "axios";
import { api } from "./helpers/network-prefix";
export const ls = new SecureLS({ encodingType: "aes" });

export default class User {
  /**
   * Get a NEW pair of JWT tokens from the refresh token
   * @param {Function} cb callback function (err)
   * @returns
   */
  static async getTokens(cb) {
    try {
      const token = ls.get("refresh_token");
      const get = await axios.get(`${api}/token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (get.data._embedded.error) return cb(get.data._embedded);
      ls.set("token", get.data._embedded.token);
      ls.set("refresh_token", get.data._embedded.refresh_token);
      cb(null);
    } catch (error) {
      cb(null, { error: error.message });
    }
  }

  /**
   * Gets a user from the JWT token
   * @param {Function} cb  callback function (user, err)
   */
  static async getUser(cb) {
    try {
      const token = ls.get("token");
      const get = await axios.get(`${api}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!get.data._embedded.user) {
        try {
          await User.getTokens((err) => {
            if (err) return cb(null, err);
          });
          const token = ls.get("token");
          const get2 = await axios.get(`${api}/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!get2.data._embedded.user) return cb(null, get2.data._embedded);
          cb(get2.data._embedded.user, null);
        } catch (error) {
          cb(null, { error: error.message });
        }
        return cb(null, get.data._embedded);
      }
      cb(get.data._embedded.user, null);
    } catch (error) {
      cb(null, { error: error.message });
    }
  }

  /**
   * Login and set JWT tokens
   * @param {Object} creds login creds
   * @param {Function} cb callback function (err)
   */
  static async login(creds, cb) {
    try {
      const post = await axios.post(`${api}/login`, JSON.stringify(creds), {
        headers: { "Content-Type": "application/json" },
      });
      if (post.status !== 200) cb(post.data._embedded);
      ls.set("token", post.data._embedded.token);
      ls.set("refresh_token", post.data._embedded.refresh_token);
      cb(null);
    } catch (error) {
      cb({ error: error.message });
    }
  }

  /**
   * Logout the user
   * @param {Function} cb callback function
   */
  static logout(cb) {
    ls.remove("token");
    ls.remove("refresh_token");
    cb();
  }
}
