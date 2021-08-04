import mongoose from "mongoose";
import mocha from "mocha";
import assert from "assert";
import chai from "chai";
import request from "supertest";
import app from "../app.mjs";
import Pooch from "../models/pooch.js";
import { generateAccessToken } from "../authentication/authenticate.js";
const { expect } = chai;
const { describe, it, beforeEach, afterEach } = mocha;

describe("Unit Testing -> Pooches", () => {
  beforeEach((done) => {
    mongoose
      .connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        Pooch.create({
          _id: 12345,
          name: "Sparky",
          notes: "he likes to be outside",
        })
          .then(() => done())
          .catch(done);
      })
      .catch(done);
  });

  afterEach((done) => {
    Pooch.deleteOne({ _id: 12345 })
      .then(() => done())
      .catch(done);
  });

  it("should return OK status on GET /api/pooches *AND* return a list of pooches", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .get("/api/pooches")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.body.pooches).to.be.an.instanceof(Array);
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return OK status on GET /api/pooch/:id *AND* return a pooch", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .get("/api/pooch/12345")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.body.pooch).to.have.property("name");
        expect(res.body.pooch).to.have.property("notes");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return Created status on POST /api/pooch", (done) => {
    request(app)
      .post("/api/pooch")
      .send({
        _id: 123456,
        name: "Sparky",
        notes: "he likes to be outside",
      })
      .then((res) => {
        assert.strictEqual(res.status, 201);
        Pooch.deleteOne({ _id: 123456 })
          .then(() => done())
          .catch(done);
      })
      .catch(done);
  });

  it("should return OK status on PATCH /api/pooch/:id *AND* return updated pooch", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .patch("/api/pooch/12345")
      .set({ authorization: `Bearer ${token}` })
      .send({ name: "Max" })
      .then((res) => {
        expect(res.body.pooch.name).to.be.equal("Max");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return No Content status on DELETE /api/pooch/:id", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .delete("/api/pooch/12345")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        assert.strictEqual(res.status, 204);
        done();
      })
      .catch(done);
  });
});
