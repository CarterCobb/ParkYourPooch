import mocha from "mocha";
import assert from "assert";
import chai from "chai";
import request from "supertest";
import app from "../app.mjs";
const { expect } = chai;
const { describe, it } = mocha;

describe("Unit Testing -> Server Status", () => {
  it("should return OK status", () => {
    return request(app)
      .get("/")
      .then((res) => assert.strictEqual(res.status, 200));
  });
  it("should return success message", () => {
    return request(app)
      .get("/")
      .then((res) =>
        expect(res.body.message).to.contain("Server Opperational")
      );
  });
});
