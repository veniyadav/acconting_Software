import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ✅ Helper function to safely serialize BigInt
function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

// 🔹 Create new eway bill
export const createEwayBill = async (req, res) => {
  try {
    const { company_id, ewb_no, date, from_place, to_place, value, valid_until, status } = req.body;

    const ewayBill = await prisma.ewaybills.create({
      data: {
        company_id,
        ewb_no,
        date: date ? new Date(date) : null,
        from_place,
        to_place,
        value,
        valid_until: valid_until ? new Date(valid_until) : null,
        status,
      },
    });

    res.status(201).json(serializeBigInt(ewayBill));
  } catch (error) {
    console.error('❌ Error creating eway bill:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Get all eway bills
export const getAllEwayBills = async (req, res) => {
  try {
    const ewayBills = await prisma.ewaybills.findMany({
      orderBy: { id: 'desc' },
    });

    res.status(200).json(serializeBigInt(ewayBills));
  } catch (error) {
    console.error('❌ Error fetching eway bills:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Get single eway bill by ID
export const getEwayBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const ewayBill = await prisma.ewaybills.findUnique({
      where: { id: BigInt(id) },
    });

    if (!ewayBill) {
      return res.status(404).json({ message: 'Eway bill not found' });
    }

    res.status(200).json(serializeBigInt(ewayBill));
  } catch (error) {
    console.error('❌ Error fetching eway bill:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Update eway bill by ID
export const updateEwayBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_id, ewb_no, date, from_place, to_place, value, valid_until, status } = req.body;

    const ewayBill = await prisma.ewaybills.update({
      where: { id: BigInt(id) },
      data: {
        company_id,
        ewb_no,
        date: date ? new Date(date) : null,
        from_place,
        to_place,
        value,
        valid_until: valid_until ? new Date(valid_until) : null,
        status,
        updated_at: new Date(),
      },
    });

    res.status(200).json(serializeBigInt(ewayBill));
  } catch (error) {
    console.error('❌ Error updating eway bill:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Delete eway bill by ID
export const deleteEwayBill = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.ewaybills.delete({
      where: { id: BigInt(id) },
    });

    res.status(200).json({ message: 'Eway bill deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting eway bill:', error);
    res.status(500).json({ error: error.message });
  }
};