import { describe, it, expect } from "vitest";
import request from "supertest";
import Express from "express";
import IndexRouter from "../routes/index.js";

const app = Express();
app.use(Express.json());
app.use("/", IndexRouter);

describe("Teacher routes", () => {
  it("GET /teachers returns 200 and array of teachers", async () => {
    const res = await request(app).get("/teachers");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("meta");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it("GET /teachers returns valid teacher objects", async () => {
  const res = await request(app).get("/teachers");

  expect(res.body.data.length).toBeGreaterThan(0); // at least one teacher

  for (const teacher of res.body.data) {
    expect(teacher).toHaveProperty("id");
    expect(teacher).toHaveProperty("name");
    expect(teacher).toHaveProperty("email");

    // Optional: check types
    expect(typeof teacher.id).toBe("number");
    expect(typeof teacher.name).toBe("string");
    expect(typeof teacher.email).toBe("string");

    // Optional: check email format
    expect(teacher.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }
});
});