import express from "express";
import request from "supertest";

// Test aplikasi sederhana
describe("Basic App Tests", () => {
  // Setup express app sederhana untuk testing
  const app = express();
  app.use(express.json());

  // Route sederhana untuk test
  app.get("/health", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
  });

  app.post("/echo", (req, res) => {
    res.status(200).json({ received: req.body });
  });

  // Test case 1: Test GET endpoint
  test("GET /health should return 200", async () => {
    const response = await request(app).get("/health").expect(200); // Expect status 200

    expect(response.body.message).toBe("Server is healthy");
  });

  // Test case 2: Test POST endpoint
  test("POST /echo should return posted data", async () => {
    const testData = { name: "John", age: 25 };

    const response = await request(app)
      .post("/echo")
      .send(testData)
      .expect(200);

    expect(response.body.received).toEqual(testData);
  });

  // Test case 3: Test error handling
  test("GET /nonexistent should return 404", async () => {
    await request(app).get("/nonexistent").expect(404);
  });
});
