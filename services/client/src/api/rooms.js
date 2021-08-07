import { api } from "./helpers/network-prefix";
import axios from "axios";

export default class Room {
  /**
   * Get all the rooms
   * @param {Function} cb (rooms, err)
   */
  static async getAll(cb) {
    try {
      const get = await axios.get(`${api}/rooms`);
      if (get.status !== 200) cb(null, get.data._embedded);
      cb(get.data._embedded.rooms, null);
    } catch (error) {
      cb({ error: error.message });
    }
  }
}
