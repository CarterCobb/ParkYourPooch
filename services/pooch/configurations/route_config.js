import Express from "express";
import pooch from "../routes/pooch";

/**
 * Constructs routes from the imported object lists.
 * Then assigns them to the instance of the Express app.
 */
export default class RouteConf {
  /**
   * Constructs and assigns the routes to the app instance
   * @param {Express.Application} instance
   */
  constructor(instance) {
    this.app = instance;
    this.app.get("/", (_req, res) =>
      res.status(200).json({ message: "Server Opperational" })
    );
    this.configureRoutes(pooch);
  }

  /**
   * Constructs routes and assigns them to the app.
   * @param {Array} routes
   */
  configureRoutes(routes) {
    routes.forEach((route) =>
      this.app[route.type].bind(this.app)(route.url, ...route.handlers)
    );
  }
}
