import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        required: true,
        ref: "Products",
      },
    ],

    payment: {
      type: Object,
      required: true,
    },
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "delivered", "cancelled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);







