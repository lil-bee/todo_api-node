import request from "supertest";
import { createJWT } from "../modules/auth";
import app from "../server";
import { testDb } from "./setup";

const fakeUser = { id: "1", username: "test" };
const token = createJWT(fakeUser);

beforeAll(async () => {
  // Pastikan user dummy ada
  await testDb.query(`DELETE FROM users`);
  await testDb.query(
    `INSERT INTO users (id, email, password) VALUES ($1, $2, $3)`,
    [1, "test@example.com", "hashedpassword"]
  );

  // Buat 2 data dummy todo
  await testDb.query(`DELETE FROM todos`);
  await testDb.query(
    `INSERT INTO todos (title, description, user_id) VALUES 
     ('Todo 1', 'Description 1', $1),
     ('Todo 2', 'Description 2', $1)`,
    [1]
  );
});

describe("GET /api/todos", () => {
  it("should reject request without token", async () => {
    const res = await request(app).get("/api/todos");
    expect(res.status).toBe(401);
  });

  it("should return todos with valid token", async () => {
    const res = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveProperty("data");
    expect(res.body.data.data.length).toBeGreaterThanOrEqual(2);
  });
});

describe("POST /api/todos", () => {
  it("should create a new todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        description: "Created via test",
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.title).toBe("Test Post");
  });
});

let createdTodoId: number;
describe("GET /api/todos/:id", () => {
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Get Me",
        description: "Testing GET by ID",
      });

    createdTodoId = res.body.data.todo_id;
  });

  it("should return todo by ID", async () => {
    const res = await request(app)
      .get(`/api/todos/${createdTodoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.todo_id).toBe(createdTodoId);
  });

  it("should return 404 if todo not found", async () => {
    const res = await request(app)
      .get("/api/todos/9999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Todo not Found");
  });
});

describe("PUT /api/todos/:id", () => {
  it("should update todo by ID", async () => {
    const res = await request(app)
      .put(`/api/todos/${createdTodoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
        description: "Updated Description",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Updated Title");
  });

  it("should return 404 if todo not found", async () => {
    const res = await request(app)
      .put("/api/todos/9999999")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "x", description: "x" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Todo not Found");
  });
});

describe("DELETE /api/todos/:id", () => {
  it("should delete todo by ID", async () => {
    const res = await request(app)
      .delete(`/api/todos/${createdTodoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it("should return 404 if already deleted", async () => {
    const res = await request(app)
      .get(`/api/todos/${createdTodoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should reject deletion if todo not owned by user", async () => {
    // Simpan todo milik user_id 2
    await testDb.query(
      `INSERT INTO users (id, email, password) VALUES (2, 'other@example.com', 'pass') ON CONFLICT DO NOTHING`
    );
    const result = await testDb.query(
      `INSERT INTO todos (title, description, user_id) VALUES ('Not yours', 'unauthorized delete test', 2) RETURNING *`
    );

    const res = await request(app)
      .delete(`/api/todos/${result.rows[0].todo_id}`)
      .set("Authorization", `Bearer ${token}`); // Masih token user_id 1

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("You are not allowed to access this todo");
  });
});
