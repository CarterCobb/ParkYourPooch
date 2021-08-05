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
      const post = await axios.get(`${api}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!post.data_embedded.user) {
        try {
          await User.getTokens((err) => {
            if (err) return cb(null, err);
          });
          const token = ls.get("token");
          const post2 = await axios.get(`${api}/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!post2.data_embedded.user) return cb(null, post.data._embedded);
          cb(post2.data._embedded.user, null);
        } catch (error) {
          cb(null, { error: error.message });
        }
        return cb(null, post.data._embedded);
      }
      cb(post.data._embedded.user, null);
    } catch (error) {
      cb(null, { error: error.message });
    }
  }
}
