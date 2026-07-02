import express from "express";
import {
  // brainTreePaymentController,
  // braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayOrderController,
  razorpayVerifyController

} from "../controllers/productController.js";
import formidable from "express-formidable";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", relatedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
// router.get("/braintree/token", braintreeTokenController);

//payments
// router.post("/braintree/payment", requireSignIn, brainTreePaymentController);


//payment--

router.post("/razorpay/create-order", requireSignIn, createRazorpayOrder);
router.post("/razorpay/verify", requireSignIn, verifyRazorpayPayment);

router.post("/razorpay/order", razorpayOrderController);
router.post("/razorpay/verify", razorpayVerifyController);


export default router;