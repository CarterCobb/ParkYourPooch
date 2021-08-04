import mongoose from "mongoose";
import mocha from "mocha";
import assert from "assert";
import chai from "chai";
import request from "supertest";
import app from "../app.mjs";
import Order from "../models/order.js";
import { generateAccessToken } from "../authentication/authenticate.js";
const { expect } = chai;
const { describe, it, beforeEach, afterEach } = mocha;

describe("Unit Testing -> Orders", () => {
  beforeEach((done) => {
    mongoose
      .connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        Order.create({
          _id: 12345,
          name: "Billy",
          card_number: 4242424242424242,
          cvv: 123,
          expires: "12/25",
          total: 5000,
          booking_gty: 2,
        })
          .then(() => done())
          .catch(done);
      })
      .catch(done);
  });

  afterEach((done) => {
    Order.deleteOne({ _id: 12345 })
      .then(() => done())
      .catch(done);
  });

  it("should return OK status on GET /api/orders *AND* return a list of orders", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .get("/api/orders")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.body.orders).to.be.an.instanceof(Array);
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return OK status on GET /api/order/:id *AND* return an order", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .get("/api/order/12345")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.body.order).to.have.property("name");
        expect(res.body.order).to.have.property("card_number");
        expect(res.body.order).to.have.property("cvv");
        expect(res.body.order).to.have.property("expires");
        expect(res.body.order).to.have.property("total");
        expect(res.body.order).to.have.property("booking_qty");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return Created status on POST /api/order", (done) => {
    request(app)
      .post("/api/order")
      .send({
        _id: 123456,
        name: "Billy",
        card_number: 4111111111111111,
        cvv: 123,
        expires: "12/25",
        total: 5000,
        booking_gty: 2,
      })
      .then((res) => {
        assert.strictEqual(res.status, 201);
        Order.deleteOne({ _id: 123456 })
          .then(() => done())
          .catch(done);
      })
      .catch(done);
  });

  it("should return OK status on PATCH /api/order/:id *AND* return updated order", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .patch("/api/order/12345")
      .set({ authorization: `Bearer ${token}` })
      .send({ cvv: 124 })
      .then((res) => {
        expect(res.body.order.cvv).to.be.equal(124);
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return No Content status on DELETE /api/order/:id", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .delete("/api/order/12345")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        assert.strictEqual(res.status, 204);
        done();
      })
      .catch(done);
  });
});
