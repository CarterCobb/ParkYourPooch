import mongoose from "mongoose";
import Room from "../models/room.js";
import { authenticate } from "../authentication/authenticate.js";
const { connection } = mongoose;

export default [
  /**
   * Get all rooms
   */
  {
    url: "/api/rooms",
    type: "get",
    handlers: [
      async (_req, res) => {
        try {
          if (connection.readyState === 1) {
            const rooms = await Room.find().lean();
            return res.status(200).json({ rooms });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Get room by its id
   */
  {
    url: "/api/room/:id",
    type: "get",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const room = await Room.findById(req.params.id).lean();
            if (!room) return res.status(404).json({ error: "room not found" });
            return res.status(200).json({ room });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Create a room
   */
  {
    url: "/api/room",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          if (connection.readyState === 1) await Room.create(req.body);
          else return res.status(500).json({ error: "Database Error" });
          return res.sendStatus(201);
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Update all or parts of a room
   */
  {
    url: "/api/room/:id",
    type: "patch",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const old_room = await Room.findOne({
              _id: req.params.id,
            }).lean();
            const updated_room = await Room.findOneAndUpdate(
              { _id: req.params.id },
              { $set: { ...old_room, ...req.body } },
              { upsert: false, new: true, runValidators: true }
            ).lean();
            return res.status(200).json({ room: updated_room });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Delete a room by its id
   */
  {
    url: "/api/room/:id",
    type: "delete",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            await Room.deleteOne({ _id: req.params.id });
            return res.sendStatus(204);
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Addd a pooch booking to a room
   */
  {
    url: "/api/room/:id/book",
    type: "put",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const updated_room = await Room.findOneAndUpdate(
              { _id: req.params.id },
              { $push: { bookings: req.body } },
              { upsert: false, new: true, runValidators: true }
            ).lean();
            return res.status(200).json({ room: updated_room });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * removes apooch booking from the room
   */
  {
    url: "/api/room/:id/unbook/:pooch",
    type: "delete",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const room = await Room.findOne({ _id: req.params.id }).lean();
            if (!room) return res.status(404).json({ error: "no room found" });
            const pooch = room.bookings.find(
              (x) => x.pooch === req.params.pooch
            );
            if (!pooch)
              return res.status(404).json({ error: "no pooch found" });
            const updated_room = await Room.findOneAndUpdate(
              { _id: req.params.id },
              { $pull: { bookings: pooch } },
              { upsert: false, new: true, runValidators: true }
            );
            return res.status(200).json({ room: updated_room });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
];
