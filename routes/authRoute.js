import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  refreshTokenController,
  verifyOTPController,
  resendOTPController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { validate, registerSchema, loginSchema } from "../middlewares/validate.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", validate(registerSchema), registerController);

//LOGIN || POST
router.post("/login", validate(loginSchema), loginController);

//Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

router.post("/verify-otp", verifyOTPController);
router.post("/resend-otp", resendOTPController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

// Refresh token
router.post("/refresh-token", refreshTokenController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;