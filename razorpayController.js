// backend/razorpayController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const amount = req.body.amount * 100; // in paise
    const options = { amount, currency: "INR", receipt: `rcpt_${Date.now()}` };
    const order = await razorpay.orders.create(options);
    return res.json(order);
  } catch (err) {
    console.error("Order creation failed:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const hmac = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (hmac === razorpay_signature) {
    // Payment valid: save order to DB
    return res.json({ success: true });
  } else {
    return res.status(400).json({ error: "Payment verification failed" });
  }
};
