//dipanshu patidar
import { PrismaClient, products_status } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to convert BigInt to string for JSON serialization
const serializeBigInt = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => 
      typeof value === 'bigint' ? value.toString() : value
    )
  );
};

// ✅ Helper to normalize status
const normalizeStatus = (status) => {
  if (!status) return products_status.active;           // default
  const lower = status.toLowerCase();
  
  // Map to the actual enum values
  if (lower === "active") return products_status.active;
  if (lower === "inactive") return products_status.inactive;
  if (lower === "discontinued") return products_status.discontinued;
  
  return products_status.active; // default if invalid
};

// ✅ Create product
export const createProduct = async (req, res) => {
  try {
    const data = req.body;

    const newProduct = await prisma.products.create({
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : null,
        warehouse_id: data.warehouse_id ? BigInt(data.warehouse_id) : null,
        category_id: data.category_id ? BigInt(data.category_id) : null,
        unit_id: data.unit_id ? BigInt(data.unit_id) : null,
        product_name: data.product_name || null,
        sku: data.sku || null,
        hsn_code: data.hsn_code || null,
        barcode: data.barcode || null,
        brand: data.brand || null,
        model_no: data.model_no || null,
        color: data.color || null,
        material: data.material || null,
        size: data.size || null,
        stock_quantity: data.stock_quantity ? Number(data.stock_quantity) : null,
        reorder_level: data.reorder_level ? Number(data.reorder_level) : null,
        purchase_rate: data.purchase_rate ? Number(data.purchase_rate) : null,
        selling_rate: data.selling_rate ? Number(data.selling_rate) : null,
        tax_id: data.tax_id ? BigInt(data.tax_id) : null,
        status: normalizeStatus(data.status),
      },
    });

    // Serialize BigInt values before sending response
    const serializedProduct = serializeBigInt(newProduct);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: serializedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ✅ Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      orderBy: { id: "desc" },
    });

    // Serialize BigInt values before sending response
    const serializedProducts = serializeBigInt(products);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: serializedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ✅ Get products by company ID
export const getProductsByCompanyId = async (req, res) => {
  try {
    const companyId = BigInt(req.params.companyId);

    const products = await prisma.products.findMany({
      where: { company_id: companyId },
      orderBy: { id: "desc" },
    });

    // Serialize BigInt values before sending response
    const serializedProducts = serializeBigInt(products);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: serializedProducts,
    });
  } catch (error) {
    console.error("Error fetching products by company ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ✅ Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const id = BigInt(req.params.id);

    const product = await prisma.products.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Serialize BigInt values before sending response
    const serializedProduct = serializeBigInt(product);

    res.status(200).json({
      success: true,
      data: serializedProduct,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const data = req.body;

    const updated = await prisma.products.update({
      where: { id },
      data: {
        company_id: data.company_id ? BigInt(data.company_id) : undefined,
        warehouse_id: data.warehouse_id ? BigInt(data.warehouse_id) : undefined,
        category_id: data.category_id ? BigInt(data.category_id) : undefined,
        unit_id: data.unit_id ? BigInt(data.unit_id) : undefined,
        product_name: data.product_name || undefined,
        sku: data.sku || undefined,
        hsn_code: data.hsn_code || undefined,
        barcode: data.barcode || undefined,
        brand: data.brand || undefined,
        model_no: data.model_no || undefined,
        color: data.color || undefined,
        material: data.material || undefined,
        size: data.size || undefined,
        stock_quantity: data.stock_quantity ? Number(data.stock_quantity) : undefined,
        reorder_level: data.reorder_level ? Number(data.reorder_level) : undefined,
        purchase_rate: data.purchase_rate ? Number(data.purchase_rate) : undefined,
        selling_rate: data.selling_rate ? Number(data.selling_rate) : undefined,
        tax_id: data.tax_id ? BigInt(data.tax_id) : undefined,
        status: data.status ? normalizeStatus(data.status) : undefined,
      },
    });

    // Serialize BigInt values before sending response
    const serializedProduct = serializeBigInt(updated);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: serializedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ✅ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const id = BigInt(req.params.id);

    await prisma.products.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};