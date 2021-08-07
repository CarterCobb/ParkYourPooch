import Eureka from "../models/Eureka.js";
import Links from "../models/Links.js";
import ResBody from "../models/ResBody.js";

export default [
  /**
   * Get all the rooms
   */
  {
    url: "/api/v1/rooms",
    type: "get",
    handlers: [
      async (req, res) => {
        try {
          const roomClient = await Eureka.getClientByName("room-service");
          const items = await roomClient.get("/rooms");
          if (!items.data.rooms)
            return res
              .status(items.status)
              .json(ResBody.errorJSON(items.status, items.data));
          return res.status(items.status).json({
            _embedded: { rooms: items.data.rooms },
            _links: Links.generate(items.data.rooms, req.url, "room"),
          });
        } catch (error) {
          return res.status(500).json(ResBody.errorJSON(500, error));
        }
      },
    ],
  },
  /**
   * Get a room by is id
   */
  {
    url: "/api/v1/room/:id",
    type: "get",
    cache: true,
    handlers: [
      async (req, res) => {
        try {
          const roomClient = await Eureka.getClientByName("room-service");
          const item = await roomClient.get(`/room/${req.params.id}`);
          if (!item.data.room)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { room: item.data.room },
            _links: Links.generate(item.data.room, req.url, "room", [
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
   * Create a room
   */
  {
    url: "/api/v1/room",
    type: "post",
    handlers: [
      async (req, res) => {
        try {
          const roomClient = await Eureka.getClientByName("room-service");
          const item = await roomClient.post("/room", {
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
   * Update all or part of the room object
   */
  {
    url: "/api/v1/room/:id",
    type: "patch",
    handlers: [
      async (req, res) => {
        try {
          const roomClient = await Eureka.getClientByName("room-service");
          const item = await roomClient.patch(`/room/${req.params.id}`, {
            data: JSON.stringify(req.body),
            headers: { ...req.headers },
          });
          if (!item.data.room)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { room: item.data.room },
            _links: Links.generate(item.data.room, req.url, "room", [
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
   * Adds a pooch to the room bookings
   */
  {
    url: "/api/v1/room/:id/book",
    type: "put",
    handlers: [
      async (req, res) => {
        try {
          const roomClient = await Eureka.getClientByName("room-service");
          const item = await roomClient.put(`/room/${req.params.id}/book`, {
            data: JSON.stringify(req.body),
            headers: { ...req.headers },
          });
          if (!item.data.room)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { room: item.data.room },
            _links: Links.generate(item.data.room, req.url, "room", [
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
   * Remove a pooch from the room bookings
   */
  {
    url: "/api/v1/room/:id/unbook/:pooch",
    type: "delete",
    handlers: [
      async (req, res) => {
        try {
          const roomClient = await Eureka.getClientByName("room-service");
          const item = await roomClient.delete(
            `/room/${req.params.id}/unbook/${req.params.pooch}`,
            {
              headers: { ...req.headers },
            }
          );
          if (!item.data.room)
            return res
              .status(item.status)
              .json(ResBody.errorJSON(item.status, item.data));
          return res.status(item.status).json({
            _embedded: { room: item.data.room },
            _links: Links.generate(item.data.room, req.url, "room", [
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
   * Delete a room
   */
  {
    url: "/api/v1/room/:id",
    type: "delete",
    handlers: [
      async (req, res) => {
        try {
          const roomClient = await Eureka.getClientByName("room-service");
          const item = await roomClient.delete(`/room/${req.params.id}`, {
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
