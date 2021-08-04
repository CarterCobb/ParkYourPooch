import mongoose from "mongoose";
import mocha from "mocha";
import assert from "assert";
import chai from "chai";
import request from "supertest";
import app from "../app.mjs";
import Customer from "../models/customer.js";
import { generateAccessToken } from "../authentication/authenticate.js";
import bcrypt from "bcryptjs";
const { expect } = chai;
const { describe, it, beforeEach, afterEach } = mocha;

const Employee = mongoose.model(
  "EMPLOYEE",
  new mongoose.Schema({
    _id: Number,
    name: {
      type: String,
      required: [true, "'name' is a required attribute of employee"],
    },
    password: {
      type: String,
      required: [true, "'password' is a required attribute of employee"],
    },
    role: {
      type: String,
      emun: ["EMPLOYEE"],
      required: [true, "'role' is a required attribute of employee"],
      default: "EMPLOYEE",
    },
  }),
  "employee"
);

describe("Unit Testing -> Customers", () => {
  beforeEach((done) => {
    mongoose
      .connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        Customer.create({
          _id: 12345,
          name: "test",
          email: "test@test.com",
          password: bcrypt.hashSync("12345"),
          role: "CUSTOMER",
          pooches: [],
        })
          .then(() => {
            Employee.create({
              _id: 12345,
              name: "Billy",
              password: bcrypt.hashSync("12345"),
              role: "EMPLOYEE",
            })
              .then(() => done())
              .catch(done);
          })
          .catch(done);
      })
      .catch(done);
  });

  afterEach((done) => {
    Customer.deleteOne({ _id: 12345 })
      .then(() => {
        Employee.deleteOne({ _id: 12345 })
          .then(() => done())
          .catch(done);
      })
      .catch(done);
  });

  it("should return OK status on GET /api/customers *AND* return a list of customers", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .get("/api/customers")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.body.customers).to.be.an.instanceof(
          Array,
          `[${res.status}] - ${JSON.stringify(res.body)}`
        );
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return OK status on GET /api/customer/:id *AND* return a customer", (done) => {
    request(app)
      .get("/api/customer/12345")
      .then((res) => {
        expect(res.body.customer).to.have.property("name");
        expect(res.body.customer).to.have.property("email");
        expect(res.body.customer).to.have.property("password");
        expect(res.body.customer).to.have.property("pooches");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return Created status on POST /api/customer", (done) => {
    request(app)
      .post("/api/customer")
      .send({
        _id: 123456,
        name: "test2",
        email: "test2@test.com",
        password: "12345",
        role: "CUSTOMER",
        pooches: [],
      })
      .then((res) => {
        assert.strictEqual(res.status, 201);
        Customer.deleteOne({ _id: 123456 })
          .then(() => done())
          .catch(done);
      })
      .catch(done);
  });

  it("should return OK status on PATCH /api/customer *AND* return the updated customer", (done) => {
    const token = generateAccessToken({ id: 12345, role: "CUSTOMER" });
    request(app)
      .patch("/api/customer")
      .set({ authorization: `Bearer ${token}` })
      .send({ name: "billy" })
      .then((res) => {
        expect(res.body.customer.name).to.be.equal("billy");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return OK status on PUT /api/customer/pooch/:pooch *AND* return updated customer", (done) => {
    const token = generateAccessToken({ id: 12345, role: "CUSTOMER" });
    request(app)
      .put(`/api/customer/pooch/12345`)
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.body.customer.pooches).to.be.lengthOf(1);
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return OK status on DELETE /api/customer/pooch/:pooch *AND* return updated customer", (done) => {
    const token = generateAccessToken({ id: 12345, role: "CUSTOMER" });
    request(app)
      .put("/api/customer/pooch/12345")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.body.customer.pooches).to.be.lengthOf(1);
        assert.strictEqual(res.status, 200);
        request(app)
          .delete("/api/customer/pooch/12345")
          .set({ authorization: `Bearer ${token}` })
          .then((res) => {
            expect(res.body.customer.pooches).to.be.lengthOf(0);
            assert.strictEqual(res.status, 200);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });

  it("should return No Content status on DELETE /api/customer", (done) => {
    const token = generateAccessToken({ id: 12345, role: "CUSTOMER" });
    request(app)
      .delete("/api/customer")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        assert.strictEqual(res.status, 204);
        done();
      })
      .catch(done);
  });

  it("should return OK status on POST /api/customer/login *AND* return JWT tokens", (done) => {
    request(app)
      .post("/api/customer/login")
      .send({ email: "test@test.com", password: "12345" })
      .then((res) => {
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("refresh_token");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });
});
