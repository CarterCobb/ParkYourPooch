import Express from "express";
import redis from "express-redis-cache";
import customer from "../routes/customer.js";
import employee from "../routes/employee.js";
import order from "../routes/order.js";
import pooch from "../routes/pooch.js";
import room from "../routes/room.js";
import { NODE_ENV } from "../keys.js";
const cache = redis({
  host: NODE_ENV === "test" ? "localhost" : "redis",
  port: 6379,
});

cache.on("connected", () => console.log(`[${process.pid}] Connected to Redis`));

/**
 * Constructs routes from the imported object lists.
 * Then assigns them to the instance of the Express app.
 */
export default class RouteConf {
  /**
   * Caches routes
   * @param {Objcet} route
   * @returns {Array} of handlers
   */
  static cacheHandlers(route) {
    return [
      route.cache && route.type === "get"
        ? cache.route(route.url.split("/")[1].replace(/:[\w\s]*/gi, ""))
        : (_req, res, next) =>
            cache.del(
              route.url.split("/")[1].replace(/:[\w\s]*/gi, ""),
              (err, deleted) => {
                if (err || !deleted)
                  return res.status(500).json({
                    _embedded: {
                      message: "Failed to delete Redis item",
                      status: 500,
                      code: "CACHE_ERROR",
                    },
                  });
                else return next();
              }
            ),
      ...route.handlers,
    ];
  }

  /**
   * Constructs routes and registers them to the app.
   *  @param {Express.Application} app
   */
  static registerTo(app) {
    app.get("/", (_req, res) =>
      res.status(200).json({ message: "Server Opperational" })
    );
    [...customer, ...employee, ...order, ...pooch, ...room].forEach((route) =>
      app[route.type].bind(app)(route.url, ...RouteConf.cacheHandlers(route))
    );
  }
}
