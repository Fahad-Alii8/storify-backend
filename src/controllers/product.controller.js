import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, status, description, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        error: "Name, price and category are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Product image is required",
      });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "products",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // Create product
    const newProduct = new Product({
      name,
      price,
      status,
      description,
      category,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Product creation error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err.message,
    });
  }
};
