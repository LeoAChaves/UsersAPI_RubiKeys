import request from "supertest";
import app from "../app.js";

describe("Users API Endpoints", () => {
  describe("GET /users", () => {
    it("should return all users emails", async () => {
      const res = await request(app).get("/users");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("emails");
    });
  });

  describe("GET /users/names", () => {
    it("should return all users names", async () => {
      const res = await request(app).get("/users/names");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("names");
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const newUser = {
        email: "test@example.com",
        name: "Teste Example",
        password: "Senha1234",
      };
      const res = await request(app).post("/users").send(newUser);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("PUT /users/name/:email", () => {
    it("should update the name of the user", async () => {
      const res = await request(app)
        .put("/users/name/test@example.com")
        .send({ newName: "Updated User" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("PUT /users/password/:email", () => {
    it("should update the password of the user", async () => {
      const res = await request(app)
        .put("/users/password/test@example.com")
        .send({ newPassword: "NewPassword123!" });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("DELETE /users/:email", () => {
    it("should delete the user", async () => {
      const res = await request(app).delete("/users/test@example.com");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message");
    });
  });
});
