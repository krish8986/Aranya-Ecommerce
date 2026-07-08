import OrderModel from "../models/orderModel.js";
import { io } from "../server.js";
import { sendOrderConfirmationEmail, sendOrderStatusEmail, sendDeliveredEmail } from "../config/email.js";

// CREATE ORDER

export const createOrderController = async (req, res) => {
  try {
    const { products, payment } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products in order",
      });
    }

    // Idempotency check — duplicate payment prevent karo
    const existingOrder = await OrderModel.findOne({
      "payment.razorpay_payment_id": payment?.razorpay_payment_id,
    });

    if (existingOrder) {
      return res.status(200).json(existingOrder); // already exists, return same
    }

    const order = await new OrderModel({
      products,
      payment,
      buyer: req.user._id,
    }).save();

    io.emit("new_order", { message: "New order placed!", orderId: order._id });

    const populatedOrder = await OrderModel.findById(order._id)
      .populate("products", "name price")
      .populate("buyer", "name email");

    await sendOrderConfirmationEmail(
      populatedOrder.buyer.email,
      populatedOrder.buyer.name,
      populatedOrder._id,
      populatedOrder.products
    );

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Error in order creation", error });
  }
};

// GET USER ORDERS
export const getUserOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({ buyer: req.user._id })
      // .populate("products", "-photo")
      .populate("products", "name description price photo")
      .populate("buyer", "name email");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error,
    });
  }
};

// GET ALL ORDERS (ADMIN)
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      // .populate("products", "-photo")
      .populate("products", "name description price photo")
      .populate("buyer", "name email");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all orders",
      error,
    });
  }
};

// UPDATE ORDER STATUS

export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    // Emit real-time status update to user
    io.emit("order_status_update", {
      orderId: order._id,
      status: order.status,
      message: `Your order status updated to: ${order.status}`,
    });

    // Send appropriate email based on status
    const populatedOrder = await OrderModel.findById(order._id).populate("buyer", "name email");

    if (status === "delivered") {
      await sendDeliveredEmail(
        populatedOrder.buyer.email,
        populatedOrder.buyer.name,
        populatedOrder._id
      );
    } else {
      await sendOrderStatusEmail(
        populatedOrder.buyer.email,
        populatedOrder.buyer.name,
        populatedOrder._id,
        status
      );
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error,
    });
  }
};

// ADMIN ANALYTICS
export const getAnalyticsController = async (req, res) => {
  try {
    // Total orders count
    const totalOrders = await OrderModel.countDocuments();

    // Orders by status
    const ordersByStatus = await OrderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Total revenue — sum of all product prices
    const revenueData = await OrderModel.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$productDetails.price" },
        },
      },
    ]);

    // Top 5 selling products
    const topProducts = await OrderModel.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products",
          totalSold: { $sum: 1 },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          name: "$productInfo.name",
          price: "$productInfo.price",
          totalSold: 1,
        },
      },
    ]);

    // Total revenue value
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue,
        ordersByStatus,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics",
      error,
    });
  }
};