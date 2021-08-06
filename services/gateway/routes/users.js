import Eureka from "../models/Eureka.js";
import ResBody from "../models/ResBody.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../keys.js";

const { verify, sign } = jwt;
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

export default [
  /**
   * Dynamic login to get JWT tokens
   */
  {
    url: "/api/v1/login",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          if (req.body.email || req.body.name) {
            if (req.body.email) {
              const customerClient = await Eureka.getClientByName(
                "customer-service"
              );
              const item = await customerClient.post("/customer/login", {
                data: JSON.stringify(req.body),
                headers: { "Content-Type": "application/json" },
              });
              if (!item.data.token)
                return res
                  .status(item.status)
                  .json(ResBody.errorJSON(item.status, item.data));
              return res.status(item.status).json({
                _embedded: { ...item.data },
              });
            } else {
              const employeeClient = await Eureka.getClientByName(
                "employee-service"
              );
              const item = await employeeClient.post("/employee/login", {
                data: JSON.stringify(req.body),
                headers: { "Content-Type": "application/json" },
              });
              if (!item.data.token)
                return res
                  .status(item.status)
                  .json(ResBody.errorJSON(item.status, item.data));
              return res.status(item.status).json({
                _embedded: { ...item.data },
              });
            }
          } else
            return res
              .status(400)
              .json(ResBody.errorJSON(400, { message: "Invalid body" }));
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Get the logged in user from the JWT token
   */
  {
    url: "/api/v1/user",
    type: "get",
    handlers: [
      async (req, res) => {
        try {
          const { authorization } = req.headers;
          const token = authorization && authorization.split(" ")[1];
          if (token === null || token === undefined)
            return res
              .status(401)
              .json(ResBody.errorJSON(401, { error: "no token" }));
          verify(token, ACCESS_TOKEN_SECRET, async (err, data) => {
            if (err) return res.status(500).json(ResBody.errorJSON(500, err));
            if (data.role === "CUSTOMER") {
              const customerClient = await Eureka.getClientByName(
                "customer-service"
              );
              const customer_item = await customerClient.get("/customer", {
                headers: { ...req.headers },
              });
              if (customer_item.status === 200)
                return res.status(customer_item.status).json({
                  _embedded: { user: customer_item.data.customer },
                });
            } else {
              const employeeClient = await Eureka.getClientByName(
                "employee-service"
              );
              const employee_item = await employeeClient.get("/employee", {
                headers: { ...req.headers },
              });
              if (employee_item.status === 200)
                return res.status(employee_item.status).json({
                  _embedded: { user: employee_item.data.employee },
                });
            }
            return res
              .status(401)
              .json(ResBody.errorJSON(401, { message: "failed to login" }));
          });
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Validates refresh token and generates a new pair of tokens.
   */
  {
    url: "/api/v1/token",
    type: "get",
    handlers: [
      async (req, res) => {
        try {
          const { authorization } = req.headers;
          const token = authorization && authorization.split(" ")[1];
          if (token === null || token === undefined)
            return res
              .status(401)
              .json(ResBody.errorJSON(401, { error: "no token" }));
          verify(token, REFRESH_TOKEN_SECRET, (err, data) => {
            if (err) return res.status(500).json(ResBody.errorJSON(500, err));
            return res.status(200).json({
              _embedded: {
                token: generateAccessToken({ id: data.id, role: data.role }),
                refresh_token: generateRefreshToken({
                  id: data.id,
                  role: data.role,
                }),
              },
            });
          });
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
];
