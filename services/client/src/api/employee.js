import { api } from "./helpers/network-prefix";
import axios from "axios";
import User from "./user";
import { ls } from "./user";

export default class Employee {
  /**
   * Update an employee object
   * @param {Object} payload items to update
   * @param {Function} cb callback function
   */
  static async updateEmployee(payload, cb) {
    try {
      const token = ls.get("token");
      const patch = await axios.patch(
        `${api}/employee`,
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
            `${api}/employee`,
            JSON.stringify(payload),
            {
              headers: {
                Authorization: `Bearer ${token2}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (patch2.status !== 204) return cb(null, patch2.data._embedded);
          cb(patch2.data._embedded.employee, null);
        } catch (error) {
          cb(null, { error: error.message });
        }
      }
      cb(patch.data._embedded.employee, null);
    } catch (error) {
      cb(null, { error: error.message });
    }
  }
}
