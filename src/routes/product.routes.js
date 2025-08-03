import express from "express";
import { createProduct } from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), createProduct);

export default router;
