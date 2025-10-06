// src/controllers/serviceController.js
import prisma from "../config/prisma.js";

// Helper: Convert BigInt to Number for JSON serialization
const convertBigInt = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    )
  );
};

// ✅ Create a service

export const createService = async (req, res) => {
  try {
    const { 
      company_id: inputCompanyId, 
      service_name, 
      sku, 
      description, 
      unit, 
      price, 
      default_tax_rate, 
      is_available_in_invoice, 
      remarks 
    } = req.body;

    let company_id = null; // Default to null

    // Only process if company_id is provided
    if (inputCompanyId !== undefined && inputCompanyId !== null) {
      // Validate it's a non-empty string/number
      if (!inputCompanyId || typeof inputCompanyId === 'boolean') {
        return res.status(400).json({
          success: false,
          message: "Invalid company_id format"
        });
      }

      try {
        // Convert to BigInt safely
        const companyIdBigInt = BigInt(inputCompanyId);
        
        // Check if company exists
        const companyExists = await prisma.companies.findUnique({
          where: { id: companyIdBigInt }
        });
        
        if (companyExists) {
          company_id = companyIdBigInt;
        } else {
          return res.status(404).json({
            success: false,
            message: "Company not found"
          });
        }
      } catch (e) {
        // Handle invalid conversion (non-integer strings, etc.)
        return res.status(400).json({
          success: false,
          message: "Invalid company_id format"
        });
      }
    }

    const newService = await prisma.services.create({
      data: {
        company_id,
        service_name,
        sku,
        description,
        unit,
        price: price ? Number(price) : null,
        default_tax_rate: default_tax_rate ? Number(default_tax_rate) : null,
        is_available_in_invoice: is_available_in_invoice !== undefined 
          ? Boolean(is_available_in_invoice) 
          : true,
        remarks,
      },
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service: convertBigInt(newService), // Ensure this handles BigInts
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create service",
      error: error.message,
    });
  }
};

// ✅ Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.services.findMany({
      orderBy: { id: "desc" },
    });

    res.status(200).json({
      success: true,
      service: services.map(convertBigInt),
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

// ✅ Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const service = await prisma.services.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      service: convertBigInt(service),
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

// ✅ Update service
export const updateService = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const data = req.body;

    let company_id;
    if (data.company_id !== undefined) {
      if (data.company_id === null || data.company_id === "" || data.company_id === undefined) {
        company_id = null;
      } else {
        const companyIdNum = Number(data.company_id);
        if (!isNaN(companyIdNum)) {
          const companyExists = await prisma.companies.findUnique({
            where: { id: BigInt(companyIdNum) },
          });
          company_id = companyExists ? BigInt(companyIdNum) : null;
        } else {
          company_id = null;
        }
      }
    }

    const updateData = {
      ...(data.service_name !== undefined && { service_name: data.service_name }),
      ...(data.sku !== undefined && { sku: data.sku }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.unit !== undefined && { unit: data.unit }),
      ...(data.price !== undefined && { price: data.price ? Number(data.price) : null }),
      ...(data.default_tax_rate !== undefined && { 
        default_tax_rate: data.default_tax_rate ? Number(data.default_tax_rate) : null 
      }),
      ...(data.is_available_in_invoice !== undefined && { 
        is_available_in_invoice: Boolean(data.is_available_in_invoice) 
      }),
      ...(data.remarks !== undefined && { remarks: data.remarks }),
      ...(company_id !== undefined && { company_id }), // Only add if we processed it
    };

    const updatedService = await prisma.services.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: convertBigInt(updatedService),
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: error.message,
    });
  }
};

// ✅ Delete service
export const deleteService = async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    await prisma.services.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
      error: error.message,
    });
  }
};