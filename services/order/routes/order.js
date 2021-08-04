import mongoose from "mongoose";
import Order from "../models/order.js";
import { authenticate } from "../authentication/authenticate.js";
const { connection } = mongoose;

export default [
  /**
   * Get all orders
   */
  {
    url: "/api/orders",
    type: "get",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (req.user.role === "CUSTOMER")
            return res.status(403).json({ error: "employee only route" });
          if (connection.readyState === 1) {
            const orders = await Order.find().lean();
            return res.status(200).json({ orders });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Get an order by its id
   */
  {
    url: "/api/order/:id",
    type: "get",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (req.user.role === "CUSTOMER")
            return res.status(403).json({ error: "employee only route" });
          if (connection.readyState === 1) {
            const order = await Order.findById(req.params.id).lean();
            if (!order)
              return res.status(404).json({ error: "order not found" });
            return res.status(200).json({ order });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Create an order
   */
  {
    url: "/api/order",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          if (connection.readyState === 1) await Order.create(req.body);
          else return res.status(500).json({ error: "Database Error" });
          return res.sendStatus(201);
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Update all or part of an order
   */
  {
    url: "/api/order/:id",
    type: "patch",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const old_order = await Order.findOne({
              _id: req.params.id,
            }).lean();
            const updated_order = await Order.findOneAndUpdate(
              { _id: req.params.id },
              { $set: { ...old_order, ...req.body } },
              { upsert: false, new: true, runValidators: true }
            ).lean();
            return res.status(200).json({ order: updated_order });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Delete an order by its id
   */
  {
    url: "/api/order/:id",
    type: "deelte",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            await Order.deleteOne({ _id: req.params.id });
            return res.sendStatus(204);
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
];
