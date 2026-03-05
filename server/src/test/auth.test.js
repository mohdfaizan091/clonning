import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../user/user.model.js";
import connectDB from "../utils/db.js";

// Tests se pehle DB connect karo
beforeAll(async () => {
  await connectDB();
}, 30000);

// Test ke baad DB clean karo
afterAll(async () => {
  await User.deleteMany({ email: /testuser/i });
  await mongoose.connection.close();
}, 30000);

describe("Auth Routes", () => {
  const testUser = {
    username: "testuser",
    email: "testuser@test.com",
    password: "Test1234",
  };

  describe("POST /api/v1/auth/register", () => {
    test("should register a new user", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    }, 15000);

    test("should fail if user already exists", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    }, 15000);

    test("should fail with weak password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ ...testUser, email: "other@test.com", password: "weak" });

      expect(res.status).toBe(400);
    }, 15000);

    test("should fail with invalid email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ ...testUser, email: "notanemail" });

      expect(res.status).toBe(400);
    }, 15000);
  });

  describe("POST /api/v1/auth/login", () => {
    test("should login with correct credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }, 15000);

    test("should fail with wrong password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: testUser.email, password: "WrongPass1" });

      expect(res.status).toBe(401);
    }, 15000);

    test("should fail with non-existent email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "nobody@test.com", password: "Test1234" });

      expect(res.status).toBe(401);
    }, 15000);
  });

  describe("GET /api/v1/auth/me", () => {
    test("should fail without token", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    }, 15000);
  });
});