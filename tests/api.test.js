import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Simple express app for testing
const app = express();
app.use(express.json());

// Import routes
import authRoutes from "../routes/authRoute.js";
import productRoutes from "../routes/productRoutes.js";
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);

// Connect to test DB
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

// ============ TESTS ============

describe("Auth API", () => {

    test("POST /register — should fail with missing fields", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({ name: "Test" }); // missing email, password etc

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("POST /login — should fail with wrong credentials", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "nonexistent@test.com", password: "wrongpass123" });

        expect([200, 404]).toContain(res.statusCode);
        expect(res.body.success).toBe(false);
    });

    test("POST /login — should fail with invalid email format", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "notanemail", password: "123" });

        // Zod validation should catch this
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

});

describe("Product API", () => {

    test("GET /product-list/1 — should return products array", async () => {
        const res = await request(app)
            .get("/api/v1/product/product-list/1");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.products)).toBe(true);
    });

    test("GET /get-product/:slug — should return 404 for invalid slug", async () => {
        const res = await request(app)
            .get("/api/v1/product/get-product/this-product-does-not-exist-xyz");

        expect([404, 500]).toContain(res.statusCode);
    });

    test("GET /product-count — should return total count", async () => {
        const res = await request(app)
            .get("/api/v1/product/product-count");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("total");
    });

});