import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Get all bank details
 */
const getAllBankDetails = async (req, res) => {
  try {
    const bankDetails = await prisma.bankDetails.findMany({
      include: {
        vendor: true, // Agar vendor se related ho toh
      },
    });
    res.json(bankDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get bank details by ID
 */
const getBankDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const bankDetail = await prisma.bankDetails.findUnique({
      where: { id: BigInt(id) },
      include: {
        vendor: true,
      },
    });

    if (!bankDetail) {
      return res.status(404).json({ error: 'Bank details not found' });
    }

    res.json(bankDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create new bank details
 */
const createBankDetails = async (req, res) => {
  try {
    const bankData = req.body;

    // Optional: Validate if vendorId exists
    if (bankData.vendorId) {
      const vendor = await prisma.vendors.findUnique({
        where: { id: BigInt(bankData.vendorId) },
      });
      if (!vendor) {
        return res.status(400).json({ error: 'Vendor not found' });
      }
    }

    const newBankDetail = await prisma.bankDetails.create({
      data: bankData,
    });

    res.status(201).json(newBankDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update bank details
 */
const updateBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const bankData = req.body;

    const updatedBankDetail = await prisma.bankDetails.update({
      where: { id: BigInt(id) },
      data: bankData,
    });

    res.json(updatedBankDetail);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Bank details not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete bank details
 */
const deleteBankDetails = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.bankDetails.delete({
      where: { id: BigInt(id) },
    });

    res.json({ message: 'Bank details deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Bank details not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllBankDetails,
  getBankDetailsById,
  createBankDetails,
  updateBankDetails,
  deleteBankDetails,
};