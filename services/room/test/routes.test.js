import mongoose from "mongoose";
import mocha from "mocha";
import assert from "assert";
import chai from "chai";
import request from "supertest";
import app from "../app.mjs";
import Room from "../models/room.js";
import { generateAccessToken } from "../authentication/authenticate.js";
const { expect } = chai;
const { describe, it, beforeEach, afterEach } = mocha;

describe("Unit Testing -> roomes", () => {
  beforeEach((done) => {
    mongoose
      .connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        Room.create({
          _id: 12345,
          number: "B12",
          bookings: [],
        })
          .then(() => done())
          .catch(done);
      })
      .catch(done);
  });

  afterEach((done) => {
    Room.deleteOne({ _id: 12345 })
      .then(() => done())
      .catch(done);
  });

  it("should return OK status on GET /api/rooms *AND* return a list of rooms", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .get("/api/rooms")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.body.rooms).to.be.an.instanceof(Array);
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return OK status on GET /api/room/:id *AND* return a room", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .get("/api/room/12345")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.body.room).to.have.property("number");
        expect(res.body.room).to.have.property("bookings");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return Created status on POST /api/room", (done) => {
    request(app)
      .post("/api/room")
      .send({
        _id: 123456,
        number: "B14",
        bookings: [],
      })
      .then((res) => {
        assert.strictEqual(res.status, 201);
        Room.deleteOne({ _id: 123456 })
          .then(() => done())
          .catch(done);
      })
      .catch(done);
  });

  it("should return OK status on PATCH /api/room/:id *AND* return updated room", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .patch("/api/room/12345")
      .set({ authorization: `Bearer ${token}` })
      .send({ number: "A12" })
      .then((res) => {
        expect(res.body.room.number).to.be.equal("A12");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return No Content status on DELETE /api/room/:id", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .delete("/api/room/12345")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        assert.strictEqual(res.status, 204);
        done();
      })
      .catch(done);
  });

  it("should return OK status on PUT /api/room/:id/book *AND* return updated room", (done) => {
    const token = generateAccessToken({ id: 12345, role: "CUSTOMER" });
    request(app)
      .put(`/api/room/12345/book`)
      .set({ authorization: `Bearer ${token}` })
      .send({ pooch: 12345, time: ["08/04/21", "08/05/21"] })
      .then((res) => {
        expect(res.body.room.bookings).to.be.lengthOf(1);
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return OK status on DELETE /api/room/:id/unbook/:pooch *AND* return updated room", (done) => {
    const token = generateAccessToken({ id: 12345, role: "CUSTOMER" });
    request(app)
      .put("/api/room/12345/book")
      .set({ authorization: `Bearer ${token}` })
      .send({ pooch: 12345, time: ["08/04/21", "08/05/21"] })
      .then((res) => {
        expect(res.body.room.bookings).to.be.lengthOf(1);
        assert.strictEqual(res.status, 200);
        request(app)
          .delete("/api/room/12345/unbook/12345")
          .set({ authorization: `Bearer ${token}` })
          .then((res) => {
            expect(res.body.room.bookings).to.be.lengthOf(0);
            assert.strictEqual(res.status, 200);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
});
