import Express from "express";
import mongoose from "mongoose";
const { connect, connection } = mongoose;
import Room from "../models/room.js";
import { MONGO_URL } from "../keys.js";

/**
 * Configures and connects the the MongoDB container
 */
export default class ConfigDatabase {
  /**
   * @param {Express.Application} instance
   */
  constructor(instance) {
    this.app = instance;
    this.connectToMongoose();
  }

  /**
   * Connects to MongoDB
   */
  connectToMongoose() {
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
        Room.createCollection();
      } catch (error) {
        console.warn("Room collection aready created");
      }
      console.log(`[${process.pid}] Connected to MongoDB`);
    });
  }
}
