import express from "express";
import cors from "cors";
import cluster from "cluster";
import os from "os";
import { NODE_ENV } from "./keys.js";
import DatabaseConf from "./configurations/database_config.js";
import RouteConf from "./configurations/route_config.js";
const cpus = os.cpus().length;
const app = express();

if (NODE_ENV !== "test" && cluster.isMaster && cpus > 1) {
  for (var _ = 0; _ < cpus; _++) cluster.fork();
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `[${worker.process.pid}] died; Code: ${code}; Signal: ${signal}`
    );
    cluster.fork();
  });
} else {
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(express.json({ limit: "50mb" }));
  app.use(cors());
  new DatabaseConf(app);
  new RouteConf(app);
  app.listen(1000, () =>
    console.log(`[${process.pid}] listening on port 1000`)
  );
}
export default app;
