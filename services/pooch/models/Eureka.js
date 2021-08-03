import axios from "axios";
import ip from "ip";
import Resilient from "resilient";

const eurekaService = `http://registry:8080/eureka`;

export default class Eureka {
  /**
   * Registers the service with Eureka
   * @param {String} appName name of service
   * @param {Number} port port app is running on
   */
  static register(appName, port) {
    axios
      .post(
        `${eurekaService}/apps/${appName}`,
        JSON.stringify({
          instance: {
            hostName: `localhost`,
            instanceId: `${process.pid}-${ip.address()}`,
            vipAddress: `${appName}`,
            app: `${appName.toUpperCase()}`,
            ipAddr: ip.address(),
            status: `UP`,
            port: {
              $: port,
              "@enabled": true,
            },
            dataCenterInfo: {
              "@class": `com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo`,
              name: `MyOwn`,
            },
          },
        }),
        { headers: { "Content-Type": "application/json" } }
      )
      .then(() => {
        console.log(`[${process.pid}] Registered with Eureka.`);
        setInterval(() => {
          axios
            .put(
              `${eurekaService}/apps/${appName}/${process.pid}-${ip.address()}`,
              {},
              { headers: { "Content-Type": "application/json" } }
            )
            .then(() =>
              console.log(
                `[${process.pid}] Successfully sent heartbeat to Eureka.`
              )
            )
            .catch(() =>
              console.log(
                `[${process.pid}] Sending heartbeat to Eureka failed.`
              )
            );
        }, 50 * 1000);
      })
      .catch((error) =>
        console.log(
          `[${process.pid}] Not registered with eureka due to: ${error}`
        )
      );
  }

  /**
   * Get all the registered services from Eureka
   * @returns {Array} all the services info
   */
  static async getAllApps() {
    const apps = await (await axios.get(`${eurekaService}/apps`)).data;
    return apps.applications.application;
  }

  /**
   * Get the service client by name
   * @param {String} name service name
   * @returns {Resilient} client
   */
  static async getClientByName(name) {
    const apps = await (await axios.get(`${eurekaService}/apps`)).data;
    const instances = apps.applications.application.find(
      (x) => x.name.toLowerCase() === name.toLowerCase()
    );
    if (instances) {
      const client = Resilient({ service: { basePath: "/api" } });
      const servers = instances.instance.map((x) => `http://${x.ipAddr}:1000`);
      client.setServers(servers);
      return client;
    }
    return null;
  }
}
