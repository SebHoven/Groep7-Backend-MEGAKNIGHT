import { describe, it, expect } from "vitest";
import request from "supertest";
import Express from "express";
import IndexRouter from "../src/routes/index.js";

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
});