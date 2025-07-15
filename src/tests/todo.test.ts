import request from "supertest";
import { createJWT } from "../modules/auth";
import app from "../server";

describe("GET /api/todos", () => {
  it("should reject without token", async () => {
    const res = await request(app).get("/api/todos");
    expect(res.status).toBe(401);
  });

  it("should return todos with valid token", async () => {
    const fakeUser = { id: "1", username: "test" };
    const token = createJWT(fakeUser);

    const res = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toBeInstanceOf(Object);
  });
});
