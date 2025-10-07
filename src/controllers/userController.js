// controllers/userController.js
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

/** 🔹 GET all users */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      orderBy: { created_at: "desc" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 GET single user by ID */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id: BigInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 CREATE user */
export const createUser = async (req, res) => {
  try {
    const data = req.body;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.users.create({
      data: {
        company_id: BigInt(data.company_id),
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        status: data.status || "Active",
        password: hashedPassword,
        profile_image: data.profile_image || null,
        created_at: new Date(),
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 UPDATE user */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updateData = {
      company_id: data.company_id ? BigInt(data.company_id) : undefined,
      name: data.name ?? undefined,
      email: data.email ?? undefined,
      phone: data.phone ?? undefined,
      role: data.role ?? undefined,
      status: data.status ?? undefined,
      profile_image: data.profile_image ?? undefined,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.users.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    res.json(updatedUser);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

/** 🔹 DELETE user */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.users.delete({ where: { id: BigInt(id) } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(500).json({ error: error.message });
  }
};
