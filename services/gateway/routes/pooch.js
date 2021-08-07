import Eureka from "../models/Eureka.js";
import Links from "../models/Links.js";
import ResBody from "../models/ResBody.js";

export default [
  /**
   * Get all the pooches
   */
  {
    url: "/api/v1/poochs",
    type: "get",
    handlers: [
      async (req, res) => {
        try {
          const poochClient = await Eureka.getClientByName("pooch-service");
          const items = await poochClient.get("/pooches", {
            headers: { ...req.headers },
          });
          if (!items.data.poochs)
            return res
              .status(items.status)
              .json(ResBody.errorJSON(items.status, items.data));
          return res.status(items.status).json({
            _embedded: { pooches: items.data.pooches },
            _links: Links.generate(items.data.pooches, req.url, "pooch"),
          });
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Get a pooch by their id
   */
  {
    url: "/api/v1/pooch/:id",
    type: "get",
    cache: true,
    handlers: [
      async (req, res) => {
        try {
          const poochClient = await Eureka.getClientByName("pooch-service");
          const item = await poochClient.get(`/pooch/${req.params.id}`);
          if (!item.data.pooch)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { pooch: item.data.pooch },
            _links: Links.generate(item.data.pooch, req.url, "pooch", [
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
   * Create a pooch
   */
  {
    url: "/api/v1/pooch",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          const poochClient = await Eureka.getClientByName("pooch-service");
          const item = await poochClient.post("/pooch", {
            data: JSON.stringify(req.body),
            headers: { "Content-Type": "application/json" },
          });
          if (item.status !== 200)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { pooch: item.data.pooch },
          });
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Update all or part of the pooch object
   */
  {
    url: "/api/v1/pooch/:id",
    type: "patch",
    handlers: [
      async (req, res) => {
        try {
          const poochClient = await Eureka.getClientByName("pooch-service");
          const item = await poochClient.patch(`/pooch/${req.params.id}`, {
            data: JSON.stringify(req.body),
            headers: { ...req.headers },
          });
          if (!item.data.pooch)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { pooch: item.data.pooch },
            _links: Links.generate(item.data.pooch, req.url, "pooch", [
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
   * Delete a pooch
   */
  {
    url: "/api/v1/pooch/:id",
    type: "delete",
    handlers: [
      async (req, res) => {
        try {
          const poochClient = await Eureka.getClientByName("pooch-service");
          const item = await poochClient.delete(`/pooch/${req.params.id}`, {
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
