import mongoose from "mongoose";
import Pooch from "../models/pooch.js";
import { authenticate } from "../authentication/authenticate.js";
const { connection } = mongoose;

export default [
  /**
   * Get all pooches
   */
  {
    url: "/api/pooches",
    type: "get",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (req.user.role === "CUSTOMER")
            return res.status(403).json({ error: "employee only route" });
          if (connection.readyState === 1) {
            const pooches = await Pooch.find().lean();
            return res.status(200).json({ pooches });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Get pooch by its id
   */
  {
    url: "/api/pooch/:id",
    type: "get",
    handlers: [
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const pooch = await Pooch.findById(req.params.id).lean();
            if (!pooch)
              return res.status(404).json({ error: "pooch not found" });
            return res.status(200).json({ pooch });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Create a pooch
   */
  {
    url: "/api/pooch",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          var pooch = null;
          if (connection.readyState === 1) pooch = await Pooch.create(req.body);
          else return res.status(500).json({ error: "Database Error" });
          return res.status(200).json({ pooch });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Update all or parts of a pooch
   */
  {
    url: "/api/pooch/:id",
    type: "patch",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const old_pooch = await Pooch.findOne({
              _id: req.params.id,
            }).lean();
            const updated_pooch = await Pooch.findOneAndUpdate(
              { _id: req.params.id },
              { $set: { ...old_pooch, ...req.body } },
              { upsert: false, new: true, runValidators: true }
            ).lean();
            return res.status(200).json({ pooch: updated_pooch });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Delete a pooch by its id
   */
  {
    url: "/api/pooch/:id",
    type: "delete",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            await Pooch.deleteOne({ _id: req.params.id });
            return res.sendStatus(204);
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
];
