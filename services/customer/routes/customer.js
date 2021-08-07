import mongoose from "mongoose";
import Customer from "../models/customer.js";
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
      async (req, res) => {
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
          if (connection.readyState === 1) {
            const customer = await Customer.findById(req.params.id).lean();
            if (!customer)
              return res.status(404).json({ error: "customer not found" });
            return res.status(200).json({ customer });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Get customer from JWT token
   */
  {
    url: "/api/customer",
    type: "get",
    handlers: [
      authenticate,
      (req, res) => res.status(200).json({ customer: req.user }),
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
    url: "/api/customer",
    type: "patch",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const update = {
              ...req.user,
              ...req.body,
              ...(req.body.password && {
                password: bcrypt.hashSync(req.body.password),
              }),
            };
            const updated_customer = await Customer.findOneAndUpdate(
              { _id: req.user._id },
              { $set: { ...update } },
              { upsert: false, new: true, runValidators: true }
            ).lean();
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
    type: "put",
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
    url: "/api/customer/login",
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
