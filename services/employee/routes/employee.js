import mongoose from "mongoose";
import Employee from "../models/employee.js";
import {
  authenticate,
  generateAccessToken,
  generateRefreshToken,
} from "../authentication/authenticate.js";
import bcrypt from "bcryptjs";
const { connection } = mongoose;

export default [
  /**
   * Get all the employees
   */
  {
    url: "/api/employees",
    type: "get",
    handlers: [
      authenticate,
      async (_req, res) => {
        try {
          if (connection.readyState === 1) {
            const employees = await Employee.fin().lean();
            return res.status(200).json({ employees });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Get an employee by their id
   */
  {
    url: "/api/employee/:id",
    type: "get",
    handlers: [
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const employee = await Employee.findById(req.params.id);
            if (!employee)
              return res.status(404).json({ error: "employee not found" });
            return res.status(200).json({ employee });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Create/Register an employee
   */
  {
    url: "/api/employee",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            await Employee.create({
              ...req.body,
              password: bcrypt.hashSync(req.body.password),
            });
          } else return res.status(500).json({ error: "Database Error" });
          return res.sendStatus(201);
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Update all or part of the employee object
   */
  {
    url: "/api/employee",
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
            const updated_employee = await Employee.findOneAndUpdate(
              { _id: req.user._id },
              { $set: { ...update } },
              { upsert: false, new: true, runValidators: true }
            ).lean();
            return res.status(200).json({ employee: updated_employee });
          } else return res.status(500).json({ error: "Database Error" });
        } catch (err) {
          return res.status(500).json({ error: `error: ${err}` });
        }
      },
    ],
  },
  /**
   * Delete a employee
   */
  {
    url: "/api/employee/:id",
    type: "delete",
    handlers: [
      authenticate,
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            await Employee.deleteOne({ _id: req.params.id });
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
    url: "/api/employee/login",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          if (connection.readyState === 1) {
            const employee = await Employee.findOne({ email: req.body.email });
            if (!employee)
              return res.status(404).json({ error: "no employee found" });
            if (!bcrypt.compareSync(req.body.password, employee.password))
              return res.status(400).json({ error: "Incorrect password" });
            const accessToken = generateAccessToken({
              id: employee._id,
              role: employee.role,
            });
            const refreshToken = generateRefreshToken({
              id: employee._id,
              role: employee.role,
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
