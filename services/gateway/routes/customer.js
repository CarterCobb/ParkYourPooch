import Eureka from "../models/Eureka.js";
import Links from "../models/Links.js";
import ResBody from "../models/ResBody.js";

export default [
  /**
   * Get all the customers
   */
  {
    url: "/api/v1/customers",
    type: "get",
    handlers: [
      async (req, res) => {
        try {
          const customerClient = await Eureka.getClientByName(
            "customer-service"
          );
          const items = await customerClient.get("/customers", {
            headers: { ...req.headers },
          });
          if (!items.data.customers)
            return res
              .status(items.status)
              .json(ResBody.errorJSON(items.status, items.data));
          return res.status(items.status).json({
            _embedded: { customers: items.data.customers },
            _links: Links.generate(items.data.customers, req.url, "customer"),
          });
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Get a customer by their id
   */
  {
    url: "/api/v1/customer/:id",
    type: "get",
    cache: true,
    handlers: [
      async (req, res) => {
        try {
          const customerClient = await Eureka.getClientByName(
            "customer-service"
          );
          const item = await customerClient.get(`/customer/${req.params.id}`);
          if (!item.data.customer)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { customer: item.data.customer },
            _links: Links.generate(item.data.customer, req.url, "customer", [
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
   * Create/Register a customer
   */
  {
    url: "/api/v1/customer",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          const customerClient = await Eureka.getClientByName(
            "customer-service"
          );
          const item = await customerClient.post("/customer", {
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
   * Update all or part of the customer object
   */
  {
    url: "/api/v1/customer",
    type: "patch",
    handlers: [
      async (req, res) => {
        try {
          const customerClient = await Eureka.getClientByName(
            "customer-service"
          );
          const item = await customerClient.patch("/customer", {
            data: JSON.stringify(req.body),
            headers: { ...req.headers },
          });
          if (!item.data.customer)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { customer: item.data.customer },
            _links: Links.generate(item.data.customer, req.url, "customer", [
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
   * Adds a pooch to the customer pooch list
   */
  {
    url: "/api/v1/customer/pooch/:pooch",
    type: "put",
    handlers: [
      async (req, res) => {
        try {
          const customerClient = await Eureka.getClientByName(
            "customer-service"
          );
          const item = await customerClient.put(
            `/customer/pooch/${req.params.pooch}`,
            {
              data: JSON.stringify(req.body),
              headers: { ...req.headers },
            }
          );
          if (!item.data.customer)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { customer: item.data.customer },
            _links: Links.generate(item.data.customer, req.url, "customer", [
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
   * Remove a pooch from the customer list of pooches
   */
  {
    url: "/api/v1/customer/pooch/:id",
    type: "delete",
    handlers: [
      async (req, res) => {
        try {
          const customerClient = await Eureka.getClientByName(
            "customer-service"
          );
          const item = await customerClient.delete(
            `/customer/pooch/${req.params.id}`,
            { headers: { ...req.headers } }
          );
          if (!item.data.customer)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { customer: item.data.customer },
            _links: Links.generate(item.data.customer, req.url, "customer", [
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
   * Delete a customer
   */
  {
    url: "/api/v1/customer",
    type: "delete",
    handlers: [
      async (req, res) => {
        try {
          const customerClient = await Eureka.getClientByName(
            "customer-service"
          );
          const item = await customerClient.delete("/customer", {
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
