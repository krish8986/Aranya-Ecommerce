import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js"; // Fixed import
import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";
import redis from "../config/redis.js";
import cloudinary from "../config/cloudinary.js";
import colors from "colors";

dotenv.config();

//razorpay--
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// ======================= CREATE PRODUCT =======================

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;

    // Validation
    if (!name) return res.status(400).send({ error: "Name is required" });
    if (!description) return res.status(400).send({ error: "Description is required" });
    if (!price) return res.status(400).send({ error: "Price is required" });
    if (!category) return res.status(400).send({ error: "Category is required" });
    if (!quantity) return res.status(400).send({ error: "Quantity is required" });

    // Photo from Cloudinary
    let photoData = {};
    if (req.file) {
      photoData = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const product = new productModel({
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      slug: slugify(name),
      photo: photoData,
    });

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error creating product",
    });
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
      .find({ isDeleted: false })
      .populate("category")
      .select("name description price category photo slug quantity")
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
      .select("name description price category photo slug quantity")
      .populate("category");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching single product",
      error,
    });
  }
}

// ======================= PRODUCT PHOTO =======================

// export const productPhotoController = async (req, res) => {
// try {
// const { pid } = req.params;
// 
// if (!pid || pid === "undefined") {
// return res.status(400).send({
// success: false,
// message: "Invalid product ID",
// });
// }
// 
// const product = await productModel.findById(pid).select("photo");
// 
// if (product?.photo?.url) {
// return res.redirect(product.photo.url);
// }
// 
// res.status(404).send({
// success: false,
// message: "Photo not found",
// });
// } catch (error) {
// console.error(error);
// res.status(500).send({
// success: false,
// message: "Error fetching product photo",
// error,
// });
// }
// };

export const productPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!pid || pid === "undefined") {
      return res.status(400).send({ success: false, message: "Invalid product ID" });
    }
    const product = await productModel.findById(pid).select("photo");
    if (product?.photo?.url) {
      return res.status(200).json({ url: product.photo.url });
    }
    res.status(404).send({ success: false, message: "Photo not found" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error fetching photo", error });
  }
};

// ======================= DELETE PRODUCT =======================

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndUpdate(req.params.pid, { isDeleted: true });
    res.status(200).send({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Error deleting product", error });
  }
};

// ======================= UPDATE PRODUCT =======================

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.body;

    // Validation
    if (!name) return res.status(400).send({ error: "Name is required" });
    if (!description) return res.status(400).send({ error: "Description is required" });
    if (!price) return res.status(400).send({ error: "Price is required" });
    if (!category) return res.status(400).send({ error: "Category is required" });
    if (!quantity) return res.status(400).send({ error: "Quantity is required" });

    // Find existing product
    const existingProduct = await productModel.findById(req.params.pid);

    // If new photo uploaded — delete old from Cloudinary first
    let photoData = existingProduct.photo;
    if (req.file) {
      // Delete old photo from Cloudinary
      if (existingProduct.photo?.public_id) {
        await cloudinary.v2.uploader.destroy(existingProduct.photo.public_id);
      }
      // Save new photo
      photoData = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      {
        name,
        description,
        price,
        category,
        quantity,
        shipping,
        slug: slugify(name),
        photo: photoData,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error updating product",
    });
  }
};

// ======================= FILTER PRODUCTS =======================
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find({ ...args, isDeleted: false });
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
      .find({ isDeleted: false })
      .select("-photo.data")
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
        isDeleted: false,
      })
      .select("name description price category photo slug quantity");

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
      .select("name description price category photo slug quantity")
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
    const products = await productModel.find({ category, isDeleted: false }).populate("category");

    res.status(200).send({ success: true, category, products });
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, message: "Error fetching category products", error });
  }
};

//RazorPay---

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

// ADD REVIEW
export const addReviewController = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { pid } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    const product = await productModel.findById(pid);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Add review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.totalReviews = product.reviews.length;
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error,
    });
  }
};

// GET REVIEWS
export const getReviewsController = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productModel
      .findById(pid)
      .select("reviews averageRating totalReviews");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error,
    });
  }
};