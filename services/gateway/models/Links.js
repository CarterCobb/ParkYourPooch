const urlPrefix = "http://localhost";
const PORT = 1000;

export default class Links {
  /**
   * Formats HATEOAS compliant links for responses.
   * @param {Object} item Item to condition links from
   * @param {String} caller route that was called.
   * @param {String} type api object type
   * @param {Array} params optional single item response link objects conditioned by string params set here.
   *
   * @return {Object} object representing HATEOAS compliant links
   */
  static generate(item, caller, type, params = []) {
    if (item instanceof Array) {
      return {
        _self: {
          href: `${urlPrefix}:${PORT}${caller}`,
          decription: "caller url",
          method: "GET",
        },
        items: item.map((o) => ({
          href: `${urlPrefix}:${PORT}/api/${type}/${o._id}`,
          decription: `individually retreive resource with id: ${o._id}`,
          method: "GET",
        })),
      };
    } else if (item instanceof Object) {
      return {
        self: {
          href: `${urlPrefix}:${PORT}${caller}`,
          description: "retrieve this resource individually",
          method: "GET",
        },
        ...(params.includes("all") && {
          [`all_${type}s`]: {
            href: `${urlPrefix}:${PORT}/api/${type}s`,
            description: "retrieve all resources of this type",
            method: "GET",
          },
        }),
        ...(params.includes("put") && type === "customer"
          ? {
              add_pooch: {
                href: `${urlPrefix}:${PORT}/api/${type}/${item._id}/pooch`,
                description: "add a pooch to the customer objcet",
                method: "PUT",
              },
            }
          : {
              add_booking: {
                href: `${urlPrefix}:${PORT}/api/${type}/${item._id}/pooch`,
                description: "add a pooch to a room",
                method: "PUT",
              },
            }),
        ...(params.includes("post") && {
          [`create_${type}`]: {
            href: `${urlPrefix}:${PORT}/api/${type}`,
            description: `Create a ${type}.`,
            method: "POST",
          },
        }),
        ...(params.includes("patch") && {
          patch: {
            href: `${urlPrefix}:${PORT}/api/${type}/${item._id}`,
            description:
              "update all or some mutable paramerter(s) of this object",
            method: "PATCH",
          },
        }),
        ...(params.includes("delete") && {
          delete: {
            href: `${urlPrefix}:${PORT}/api/${type}/${item._id}`,
            description: "delete this object",
            method: "DELETE",
          },
        }),
        ...(params.includes("delete2") && type === "customer"
          ? {
              remove_pooch: {
                href: `${urlPrefix}:${PORT}/api/${type}/${item._id}/remove/-pooch_id-`,
                description: "remove a pooch from the customer object",
                method: "DELETE",
              },
            }
          : {
              remove_booking: {
                href: `${urlPrefix}:${PORT}/api/${type}/${item._id}/remove/-pooch_id-`,
                description: "remove a booking for a pooch in a roomm",
                method: "DELETE",
              },
            }),
      };
    }
  }
}
