import Eureka from "../models/Eureka.js";
import Links from "../models/Links.js";
import ResBody from "../models/ResBody.js";

export default [
  /**
   * Get all the orders
   */
  {
    url: "/api/v1/orders",
    type: "get",
    handlers: [
      async (req, res) => {
        try {
          const orderClient = await Eureka.getClientByName("order-service");
          const items = await orderClient.get("/orders", {
            headers: { ...req.headers },
          });
          if (!items.data.orders)
            return res
              .status(items.status)
              .json(ResBody.errorJSON(items.status, items.data));
          return res.status(items.status).json({
            _embedded: { orders: items.data.orders },
            _links: Links.generate(items.data.orders, req.url, "order"),
          });
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Get an order by their id
   */
  {
    url: "/api/v1/order/:id",
    type: "get",
    cache: true,
    handlers: [
      async (req, res) => {
        try {
          const orderClient = await Eureka.getClientByName("order-service");
          const item = await orderClient.get(`/order/${req.params.id}`);
          if (!item.data.order)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { order: item.data.order },
            _links: Links.generate(item.data.order, req.url, "order", [
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
   * Create/Register an order
   */
  {
    url: "/api/v1/order",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          const orderClient = await Eureka.getClientByName("order-service");
          const item = await orderClient.post("/order", {
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
   * Update all or part of the order object
   */
  {
    url: "/api/v1/order/:id",
    type: "patch",
    handlers: [
      async (req, res) => {
        try {
          const orderClient = await Eureka.getClientByName("order-service");
          const item = await orderClient.patch(`/order/${req.params.id}`, {
            data: JSON.stringify(req.body),
            headers: { ...req.headers },
          });
          if (!item.data.order)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { order: item.data.order },
            _links: Links.generate(item.data.order, req.url, "order", [
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
   * Delete an order
   */
  {
    url: "/api/v1/order/:id",
    type: "delete",
    handlers: [
      async (req, res) => {
        try {
          const orderClient = await Eureka.getClientByName("order-service");
          const item = await orderClient.delete(`/order/${req.params.id}`, {
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
