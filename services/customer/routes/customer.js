import mongoose from "mongoose";
import Customer from "../models/customer.js";
import Eureka from "../models/Eureka.js";
import {
  authenticate,
  generateAccessToken,
  generateRefreshToken,
} from "../authentication/authenticate.js";
import bcrypt from "bcryptjs";
const { connection } = mongoose;

export default [
  /**
   * Get all the customers
   */
  {
    url: "/api/customers",
    type: "get",
    handlers: [
      authenticate,
      async (_req, res) => {
        try {
          if (req.user.role === "CUSTOMER")
            return res.status(403).json({ error: "employee only route" });
          if (connection.readyState === 1) {
            const customers = await Customer.find().lean();
            return res.status(200).json({ customers });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Get a customer by their id
   */
  {
    url: "/api/customer/:id",
    type: "get",
    handlers: [
      async (req, res) => {
        try {
          if (req.user.role === "CUSTOMER" && req.user._id !== req.params.id)
            return rs
              .status(403)
              .json({ error: "Cannot access other customers" });
          if (connection.readyState === 1) {
            const customer = await Customer.findById(req.params.id);
            if (!customer)
              return res.status(404).json({ error: "customer not found" });
            const pooches = [];
            for (var pooch of customer.pooches) {
              const pooch_client = await Eureka.getClientByName(
                "pooch-service"
              );
              const full_pooch = await pooch_client.get(`/pooch/${pooch}`).data
                .pooch;
              pooches.push(full_pooch);
            }
            return res.status(200).json({ customer: { ...customer, pooches } });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Create/Register a customer
   */
  {
    url: "/api/customer",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          if (connection.readyState === 1)
            await Customer.create({
              ...req.body,
              password: bcrypt.hashSync(req.body.password),
            });
          else return res.status(500).json({ error: "Database Error" });
          return res.sendStatus(201);
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Update all or part of the customer object
   */
  {
    url: "/api/customer/:id",
    type: "patch",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const update = { ...req.user, ...req.body };
            const updated_customer = await Customer.findOneAndUpdate(
              { _id: req.user._id },
              { $set: { ...update } },
              { upsert: false, new: true, runValidators: true }
            );
            return res.status(200).json({ customer: updated_customer });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Adds a pooch to the customer pooch list
   */
  {
    url: "/api/customer/pooch/:pooch",
    type: "patch",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const updated_customer = await Customer.findOneAndUpdate(
              { _id: req.user._id },
              { $push: { pooches: req.params.pooch } },
              { upsert: false, new: true, runValidators: true }
            );
            return res.status(200).json({ customer: updated_customer });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Remove a pooch from the customer list of pooches
   */
  {
    url: "/api/customer/pooch/:id",
    type: "delete",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const updated_customer = await Customer.findOneAndUpdate(
              { _id: req.user._id },
              { $pull: { pooches: req.params.id } },
              { upsert: false, new: true, runValidators: true }
            );
            return res.status(200).json({ customer: updated_customer });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Delete a customer
   */
  {
    url: "/api/customer",
    type: "delete",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            await Customer.deleteOne({ _id: req.user._id });
            return res.sendStatus(204);
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Login and get JWT tokens
   */
  {
    url: "/customer/login",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const customer = await Customer.findOne({ email: req.body.email });
            if (!customer)
              return res.status(404).json({ error: "no customer found" });
            if (!bcrypt.compareSync(req.body.password, customer.password))
              return res.status(400).json({ error: "Incorrect password" });
            const accessToken = generateAccessToken({
              id: customer._id,
              role: customer.role,
            });
            const refreshToken = generateRefreshToken({
              id: customer._id,
              role: customer.role,
            });
            return res.status(200).json({
              token: accessToken,
              refresh_token: refreshToken,
            });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
];
