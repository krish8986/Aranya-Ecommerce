import express from "express";
import { createOrderController, getUserOrdersController, getAllOrdersController, updateOrderStatusController, getAnalyticsController, } from "../controllers/orderController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create new order (Logged-in users only)
router.post("/create", requireSignIn, createOrderController);

// Get logged-in user's orders
router.get("/Orders", requireSignIn, getUserOrdersController);

// Get all orders (Admin only)
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

router.put("/order-status/:orderId", requireSignIn, isAdmin, updateOrderStatusController);

// Admin analytics
router.get("/analytics", requireSignIn, isAdmin, getAnalyticsController);

export default router;

