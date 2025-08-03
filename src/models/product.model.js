import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["inStock", "outOfStock"],
      default: "inStock",
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);
export default Product;
