import mongoose from "mongoose";
import Express from "express";
import {
  ACCESS_TOKEN_SECRET,
  NODE_ENV,
  TEST_EMPLOYEE,
  TEST_CUSTOMER,
} from "../keys.js";
import Eureka from "../models/Eureka.js";
import jwt from "jsonwebtoken";
const { connection } = mongoose;
const { verify } = jwt;

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
      return res.status(403).json({ error: "no token" });
    verify(token, ACCESS_TOKEN_SECRET, async (err, data) => {
      if (err)
        return res.status(403).json({
          error: "Invalid token. Please try again.",
        });
      if (connection.readyState === 1) {
        if (data.role === "CUSTOMER") {
          if (NODE_ENV === "test") {
            req.user = TEST_CUSTOMER;
            next();
          } else {
            const customerClient = await Eureka.getClientByName(
              "customer-service"
            );
            const customer = await customerClient.get(
              `/api/customer/${data.id}`
            ).data.customer;
            req.user = customer;
            next();
          }
        } else {
          if (NODE_ENV === "test") {
            req.user = TEST_EMPLOYEE;
            next();
          } else {
            const employeeClient = await Eureka.getClientByName(
              "employee-service"
            );
            const employee = await employeeClient.get(
              `/api/employee/${data.id}`
            ).data.employee;
            req.user = employee;
            next();
          }
        }
      } else return res.status(500).json({ error: "Server Error" });
    });
  } catch (err) {
    return res.status(500).json({ error: `error: ${err}` });
  }
};