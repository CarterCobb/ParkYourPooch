import Express from "express";
import customer from "../routes/customer.js";

/**
 * Constructs routes from the imported object lists.
 * Then assigns them to the instance of the Express app.
 */
export default class RouteConf {
  /**
   * Constructs routes and registers them to the app.
   *  @param {Express.Application} app
   */
  static registerTo(app) {
    app.get("/", (_req, res) =>
      res.status(200).json({ message: "Server Opperational" })
    );
    customer.forEach((route) =>
      app[route.type].bind(app)(route.url, ...route.handlers)
    );
  }
}
