// export const createOrderController = async (req, res) => {
//   try {
//     const { products, payment, buyer } = req.body;
//     const order = await new OrderModel({ products, payment, buyer }).save();
//     res.json(order);
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "Error in order creation",
//       error,
//     });
//   }
// };





// import OrderModel from "../models/orderModel.js";
// 
// Create order
// export const createOrderController = async (req, res) => {
  // try {
    // const { products, payment } = req.body;
    // const order = await new OrderModel({
      // products,
      // payment,
      // buyer: req.user._id, // Automatically logged-in user
    // }).save();
// 
    // res.json(order);
  // } catch (error) {
    // res.status(500).send({
      // success: false,
      // message: "Error in order creation",
      // error,
    // });
  // }
// };
// 
// Get logged-in user's orders
// export const getUserOrdersController = async (req, res) => {
  // try {
    // const orders = await OrderModel.find({ buyer: req.user._id })
      // .populate("products", "-photo")
      // .populate("buyer", "name");
// 
    // res.json(orders);
  // } catch (error) {
    // res.status(500).send({
      // success: false,
      // message: "Error fetching user orders",
      // error,
    // });
  // }
// };
// 
// Get all orders (Admin)
// export const getAllOrdersController = async (req, res) => {
  // try {
    // const orders = await OrderModel.find({})
      // .populate("products", "-photo")
      // .populate("buyer", "name");
// 
    // res.json(orders);
  // } catch (error) {
    // res.status(500).send({
      // success: false,
      // message: "Error fetching all orders",
      // error,
    // });
  // }
// };



import OrderModel from "../models/orderModel.js";

// CREATE ORDER
export const createOrderController = async (req, res) => {
  try {
    const { products, payment } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: "No products in order" });
    }

    const order = await new OrderModel({
      products,
      payment,
      buyer: req.user._id, // buyer taken from middleware
    }).save();

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
      .populate("products", "-photo")
      .populate("buyer", "name email");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Error fetching user orders", error });
  }
};

// GET ALL ORDERS (ADMIN)
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name email");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ success: false, message: "Error fetching all orders", error });
  }
};


export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating order status", error });
  }
};
