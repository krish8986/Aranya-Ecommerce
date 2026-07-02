import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js"; // ✅ Fixed import
import fs from "fs";
import slugify from "slugify";
// import braintree from "braintree";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import redis from "../config/redis.js";

dotenv.config();

//razorpay--
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Braintree gateway config
// const gateway = new braintree.BraintreeGateway({
// environment: braintree.Environment.Sandbox,
// merchantId: process.env.BRAINTREE_MERCHANT_ID,
// publicKey: process.env.BRAINTREE_PUBLIC_KEY,
// privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// });

// ======================= CREATE PRODUCT =======================
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error, message: "Error creating product" });
  }
};

// ======================= GET ALL PRODUCTS =======================

export const getProductController = async (req, res) => {
  try {
    // Check Redis cache first
    const cachedProducts = await redis.get("all_products");

    if (cachedProducts) {
      console.log("Products served from Redis cache");
      return res.status(200).send(JSON.parse(cachedProducts));
    }

    // If not in cache — fetch from MongoDB
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    // Save to Redis with 5 minute expiry
    await redis.setex("all_products", 300, JSON.stringify(products));

    res.status(200).send({
      success: true,
      totalCount: products.length,
      message: "All products fetched",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// ======================= GET SINGLE PRODUCT =======================
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error fetching single product", error });
  }
};

// ======================= PRODUCT PHOTO =======================

export const productPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;

    // Guard against undefined pid
    if (!pid || pid === "undefined") {
      return res.status(400).send({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await productModel.findById(pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching product photo",
      error,
    });
  }
};

// ======================= DELETE PRODUCT =======================
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error deleting product", error });
  }
};

// ======================= UPDATE PRODUCT =======================
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error, message: "Error updating product" });
  }
};

// ======================= FILTER PRODUCTS =======================
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args);
    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, message: "Error filtering products", error });
  }
};

// ======================= PRODUCT COUNT =======================
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.estimatedDocumentCount();
    res.status(200).send({ success: true, total });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, message: "Error counting products", error });
  }
};

// ======================= PAGINATED LIST =======================

export const productListController = async (req, res) => {
  try {
    const perPage = 4;
    const page = req.params.page ? req.params.page : 1;

    // Check Redis cache
    const cacheKey = `products_page_${page}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`Products page ${page} served from Redis cache`.bgGreen.white);
      return res.status(200).send(JSON.parse(cachedData));
    }

    // Not in cache — fetch from MongoDB
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const responseData = { success: true, products };

    // Save to Redis — 5 min expiry
    await redis.setex(cacheKey, 300, JSON.stringify(responseData));

    console.log(`Products page ${page} served from MongoDB`.bgBlue.white);

    res.status(200).send(responseData);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Error with pagination",
      error,
    });
  }
};

// ======================= SEARCH PRODUCT =======================
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, message: "Error searching products", error });
  }
};

// ======================= RELATED PRODUCTS =======================
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(200).send({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, message: "Error fetching related products", error });
  }
};

// ======================= CATEGORY-WISE PRODUCTS =======================
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");

    res.status(200).send({ success: true, category, products });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, message: "Error fetching category products", error });
  }
};

// ======================= BRAINTREE TOKEN =======================
// export const braintreeTokenController = async (req, res) => {
// try {
// gateway.clientToken.generate({}, function (err, response) {
// if (err) {
// res.status(500).send(err);
// } else {
// res.send(response);
// }
// });
// } catch (error) {
// console.error(error);
// res.status(500).send({ success: false, message: "Error generating token", error });
// }
// };
// 
// ======================= BRAINTREE PAYMENT =======================
// export const brainTreePaymentController = async (req, res) => {
// try {
// const { cart, nonce } = req.body;
// let total = 0;
// cart.forEach((item) => {
// total += item.price;
// });
// 
// gateway.transaction.sale(
// {
// amount: total,
// paymentMethodNonce: nonce,
// options: {
// submitForSettlement: true,
// },
// },
// async function (error, result) {
// if (result) {
// const order = new orderModel({
// products: cart,
// payment: result,
// buyer: req.user._id, // ✅ Corrected from res.user to req.user
// });
// await order.save();
// res.json({ ok: true });
// } else {
// res.status(500).send(error);
// }
// }
// );
// } catch (error) {
// console.error(error);
// res.status(500).send({ success: false, message: "Error processing payment", error });
// }
// };


//razor----

export const razorpayOrderController = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: req.body.amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).send({ success: false, message: "Error creating Razorpay order", error });
  }
};


//razor--
export const razorpayVerifyController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(sign)
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      // You can store payment/order in DB if needed
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Razorpay verify error:", error);
    res.status(500).send({ success: false, message: "Error verifying payment", error });
  }
};


// Add Razorpay controllers at bottom of file-----
export const createRazorpayOrder = async (req, res) => {
  try {
    const amount = req.body.amount * 100;
    const options = { amount, currency: "INR", receipt: `rcpt_${Date.now()}` };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Create Razorpay Order Error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY).update(sign).digest("hex");

  if (expectedSign === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid signature" });
  }
};

