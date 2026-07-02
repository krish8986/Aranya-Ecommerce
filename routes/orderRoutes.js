// import express from "express";
// import { createOrderController, getUserOrdersController, getAllOrdersController } from "../controllers/orderController.js";
// import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
// 
// const router = express.Router();

// Create order
// router.post("/create", requireSignIn, createOrderController);

// Get logged-in user's orders
// router.get("/my-orders", requireSignIn, getUserOrdersController);

// Get all orders (Admin)
// router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// export default router;




import express from "express";
import { createOrderController, getUserOrdersController, getAllOrdersController, updateOrderStatusController } from "../controllers/orderController.js";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create new order (Logged-in users only)
router.post("/create", requireSignIn, createOrderController);

// Get logged-in user's orders
router.get("/Orders", requireSignIn, getUserOrdersController);

// Get all orders (Admin only)
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

router.put("/order-status/:orderId", requireSignIn, isAdmin, updateOrderStatusController);


export default router;

