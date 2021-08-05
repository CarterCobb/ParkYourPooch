/**
 * Creates the JSON body of a response if errors need to be sent back to the client
 */
export default class ResBody {
  /**
   * Get the correct error JSON response
   * @param {Number} status request status code
   * @param {Object} error error object
   * @returns {Object} JSON object
   */
  static errorJSON(status, error) {
    switch (status) {
      case 400:
        return ResBody.BAD_REQUEST(error);
      case 401:
        return ResBody.UN_AUTHENTICATED_401(error);
      case 403:
        return ResBody.UN_AUTHENTICATED_403(error);
      case 404:
        return ResBody.NOT_FOUND(error);
      default:
        return ResBody.SERVER_ERROR(error);
    }
  }

  /**
   * General Server errors
   * @param {Object} error error object
   * @returns {Object} JSON object
   */
  static SERVER_ERROR(error) {
    return {
      _embedded: {
        error: "server error",
        code: 500,
        type: "SERVER_ERROR",
        message: error.message,
      },
    };
  }

  /**
   * General Server errors
   * @param {Object} error error object
   * @returns {Object} JSON object
   */
  static BAD_REQUEST(error) {
    return {
      _embedded: {
        error: "bad request",
        code: 400,
        type: "BAD_REQUEST",
        message: error.message,
      },
    };
  }

  /**
   * 401 server errors
   * @param {Object} error error object
   * @returns {Object} JSON oject
   */
  static UN_AUTHENTICATED_401(error) {
    return {
      _embedded: {
        error: "You are not authorized to access this endpoint.",
        code: 401,
        type: "NOT_AUTHORIZED",
        message: error.message,
      },
    };
  }

  /**
   * 403 forbiden server errors
   * @param {Objcet} error error object
   * @returns {Object} JSON object
   */
  static UN_AUTHENTICATED_403(error) {
    return {
      _embedded: {
        error: "You are forbiden from accessing this endpoint.",
        code: 403,
        type: "FORBIDEN",
        message: error.message,
      },
    };
  }

  /**
   * 404 server errors
   * @param {Object} error error object
   * @returns {Object} JSON object
   */
  static NOT_FOUND(error) {
    return {
      _embedded: {
        error: "entity not found",
        code: 404,
        type: "ENTITY_NOT_FOUND",
        message: error.message,
      },
    };
  }
}
