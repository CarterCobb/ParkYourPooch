import mongoose from "mongoose";
import mocha from "mocha";
import assert from "assert";
import chai from "chai";
import request from "supertest";
import app from "../app.mjs";
import Employee from "../models/employee.js";
import { generateAccessToken } from "../authentication/authenticate.js";
import bcrypt from "bcryptjs";
const { expect } = chai;
const { describe, it, beforeEach, afterEach } = mocha;

describe("Unit Testing -> Employees", () => {
  beforeEach((done) => {
    mongoose
      .connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() =>
        Employee.create({
          _id: 12345,
          name: "Billy",
          password: bcrypt.hashSync("12345"),
          role: "EMPLOYEE",
        })
          .then(() => done())
          .catch(done)
      )
      .catch(done);
  });

  afterEach((done) => {
    Employee.deleteOne({ _id: 12345 })
      .then(() => done())
      .catch(done);
  });

  it("should return OK status on GET /api/employees *AND* return a list of employees", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .get("/api/employees")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        expect(res.body.employees).to.be.an.instanceof(Array);
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return OK status on GET /api/employee/:id *AND* return an employee", (done) => {
    request(app)
      .get("/api/employee/12345")
      .then((res) => {
        expect(res.body.employee).to.have.property("name");
        expect(res.body.employee).to.have.property("password");
        expect(res.body.employee).to.have.property("role");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return Crested status on POST /api/employee", (done) => {
    request(app)
      .post("/api/employee")
      .send({
        _id: 123456,
        name: "Bob",
        password: bcrypt.hashSync("12345"),
        role: "EMPLOYEE",
      })
      .then((res) => {
        assert.strictEqual(res.status, 201);
        Employee.deleteOne({ _id: 123456 })
          .then(() => done())
          .catch(done);
      })
      .catch(done);
  });

  it("should return OK status on PATCH '/api/employee *AND* return the updated employee", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .patch("/api/employee")
      .set({ authorization: `Bearer ${token}` })
      .send({ name: "John Doe" })
      .then((res) => {
        expect(res.body.employee.name).to.be.equal("John Doe");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });

  it("should return No Content status on DELETE /api/employee", (done) => {
    const token = generateAccessToken({ id: 12345, role: "EMPLOYEE" });
    request(app)
      .delete("/api/employee/12345")
      .set({ authorization: `Bearer ${token}` })
      .then((res) => {
        assert.strictEqual(res.status, 204);
        done();
      })
      .catch(done);
  });

  it("should return OK status on POST /api/employee/login *AND* return JWT tokens", (done) => {
    request(app)
      .post("/api/employee/login")
      .send({ name: "Billy", password: "12345" })
      .then((res) => {
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("refresh_token");
        assert.strictEqual(res.status, 200);
        done();
      })
      .catch(done);
  });
});
