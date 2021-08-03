import mongoose from "mongoose";
const { connect, connection } = mongoose;
import Pooch from "../models/pooch.js";
import { MONGO_URL } from "../keys.js";

/**
 * Configures and connects the the MongoDB container
 */
export default class ConfigDatabase {
  /**
   * Connects to MongoDB
   */
  static connect() {
    try {
      connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }).catch((err) => {
        console.log("MONGO ERROR", err);
      });
    } catch (err) {
      console.log("MONGO ERROR", err);
    }
    connection.on("connected", () => {
      try {
        Pooch.createCollection();
      } catch (error) {
        console.warn("Pooch collection aready created");
      }
      console.log(`[${process.pid}] Connected to MongoDB`);
    });
  }
}
