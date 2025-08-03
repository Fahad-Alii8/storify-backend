import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.delete("/:id", deleteProduct);

export default router;
