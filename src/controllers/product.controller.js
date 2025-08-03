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
export const getAllProducts = async (req, res) => {
  try {
    const {
      search = "",
      sort = "asc",
      sortBy = "price",
      page = 1,
      limit = 10,
      category,
      status,
    } = req.query;

    const query = {
      name: { $regex: search, $options: "i" },
    };

    if (category) query.category = category;
    if (status) query.status = status;

    const sortOption = {};
    sortOption[sortBy] = sort === "desc" ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      products,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: err.message,
    });
  }
};
