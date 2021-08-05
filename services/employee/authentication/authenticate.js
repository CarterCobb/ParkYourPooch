import mongoose from "mongoose";
import Express from "express";
import Employee from "../models/employee.js";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../keys.js";
import jwt from "jsonwebtoken";
const { connection } = mongoose;
const { verify, sign } = jwt;

/**
 * Authenticate JWT tokens for request requiring authentication
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
export const authenticate = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];
    if (token === null || token === undefined)
      return res.status(401).json({ error: "no token" });
    verify(token, ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err)
        return res.status(403).json({
          error: "Invalid token. Please try again.",
        });
      if (connection.readyState === 1) {
        if (data.role === "CUSTOMER")
          return res.status(403).json({ error: "employee only route" });
        else {
          const employee = await Employee.findById(data.id).lean();
          req.user = employee;
          next();
        }
      } else return res.status(500).json({ error: "Server Error" });
    });
  } catch (err) {
    return res.status(500).json({ error: `error: ${err}` });
  }
};

/**
 * Generates the JWT token
 * @param {Object} data
 */
export const generateAccessToken = (data) => {
  return sign(data, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
};

/**
 * Generates the refresh JWT token
 * @param {Object} data
 */
export const generateRefreshToken = (data) => {
  return sign(data, REFRESH_TOKEN_SECRET, { expiresIn: "3h" });
};
