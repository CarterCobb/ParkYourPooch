import Eureka from "../models/Eureka.js";
import Links from "../models/Links.js";
import ResBody from "../models/ResBody.js";

export default [
  /**
   * Get all the employees
   */
  {
    url: "/api/v1/employees",
    type: "get",
    handlers: [
      async (req, res) => {
        try {
          const employeeClient = await Eureka.getClientByName(
            "employee-service"
          );
          const items = await employeeClient.get("/employees", {
            headers: { ...req.headers },
          });
          if (!items.data.employees)
            return res
              .status(items.status)
              .json(ResBody.errorJSON(items.status, items.data));
          return res.status(items.status).json({
            _embedded: { employees: items.data.employees },
            _links: Links.generate(items.data.employees, req.url, "employee"),
          });
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Get an employee by their id
   */
  {
    url: "/api/v1/employee/:id",
    type: "get",
    cache: true,
    handlers: [
      async (req, res) => {
        try {
          const employeeClient = await Eureka.getClientByName(
            "employee-service"
          );
          const item = await employeeClient.get(`/employee/${req.params.id}`);
          if (!item.data.employee)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { employee: item.data.employee },
            _links: Links.generate(item.data.employee, req.url, "employee", [
              "all",
              "put",
              "post",
              "patch",
              "delete",
              "delete2",
            ]),
          });
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Create/Register an employee
   */
  {
    url: "/api/v1/employee",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          const employeeClient = await Eureka.getClientByName(
            "employee-service"
          );
          const item = await employeeClient.post("/employee", {
            data: JSON.stringify(req.body),
            headers: { "Content-Type": "application/json" },
          });
          if (item.status !== 201)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.sendStatus(item.status);
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Update all or part of the employee object
   */
  {
    url: "/api/v1/employee",
    type: "patch",
    handlers: [
      async (req, res) => {
        try {
          const employeeClient = await Eureka.getClientByName(
            "employee-service"
          );
          const item = await employeeClient.patch("/employee", {
            data: JSON.stringify(req.body),
            headers: { ...req.headers },
          });
          if (!item.data.employee)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { employee: item.data.employee },
            _links: Links.generate(item.data.employee, req.url, "employee", [
              "all",
              "put",
              "post",
              "patch",
              "delete",
              "delete2",
            ]),
          });
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Delete a employee
   */
  {
    url: "/api/v1/employee",
    type: "delete",
    handlers: [
      async (req, res) => {
        try {
          const employeeClient = await Eureka.getClientByName(
            "employee-service"
          );
          const item = await employeeClient.delete("/employee", {
            headers: { ...req.headers },
          });
          if (item.status !== 204)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.sendStatus(item.status);
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
];
