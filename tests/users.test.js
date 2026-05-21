import request from "supertest";
import app from "../app.js";

describe("Users API Endpoints", () => {
  let testEmail = `test${Date.now()}@example.com`;

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const res = await request(app)
        .post("/users")
        .send({
          email: testEmail,
          name: "Test User",
          password: "Test@123456"
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty("message");
    });
  });

  describe("GET /users", () => {
    it("should return all users emails", async () => {
      const res = await request(app).get("/users");
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("emails");
    });
  });

  describe("GET /users/names", () => {
    it("should return all users names", async () => {
      const res = await request(app).get("/users/names");
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("names");
    });
  });

  describe("PUT /users/name/:email", () => {
    it("should update the name of the user", async () => {
      const res = await request(app)
        .put(`/users/name/${testEmail}`)
        .send({ newName: "Updated User Name" });
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("message");
    });
  });

  describe("PUT /users/password/:email", () => {
    it("should update the password of the user", async () => {
      const res = await request(app)
        .put(`/users/password/${testEmail}`)
        .send({ newPassword: "NewValid@123456" });
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("message");
    });
  });

  describe("DELETE /users/:email", () => {
    it("should delete the user", async () => {
      const res = await request(app).delete(`/users/${testEmail}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("message");
    });
  });
});
