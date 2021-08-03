import mongoose from "mongoose"
import Express from "express";
import Customer from "../models/customer.js";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../keys.js";
import Eureka from "../models/Eureka.js";
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
    const { authorization, login } = req.headers;
    const token = authorization && authorization.split(" ")[1];
    if (token === null || token === undefined)
      return res.status(403).json({ error: "no token" });
    verify(token, ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err)
        return res.status(403).json({
          error: "Invalid token. Please try again.",
        });
      if (connection.readyState === 1) {
        if (data.role === "CUSTOMER") {
          const customer = await Customer.findById(data.id);
          req.user = customer;
          next();
        } else {
          const employeeClient = await Eureka.getClientByName(
            "employee-service"
          );
          const employee = await employeeClient.get(`/employee/${data.id}`).data
            .employee;
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
