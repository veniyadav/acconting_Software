// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import accountsRoutes from "./src/routes/accounts.routes.js";
import customerRoutes from './src/routes/customer.routes.js';
import productRoutes from "./src/routes/product.routes.js";
import servicesRoutes from "./src/routes/service.routes.js";
import posRoutes from "./src/routes/pos.routes.js";
import stockTransferRoutes from "./src/routes/stockTransfer.routes.js";
import bankDetailsRoutes from "./src/routes/bankDetailsRoutes.js"
import salesReturnRoutes from "./src/routes/salesReturnController.js";
import unitRoutes from "./src/routes/unit.routes.js";
import quotationRoutes from "./src/routes/quotation.routes.js";
dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

//Routes
app.use("/api/accounts", accountsRoutes);
app.use('/api/customers', customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/stock-transfers", stockTransferRoutes);
app.use("api/pos",posRoutes);
app.use("/api/bankdetails",bankDetailsRoutes);
app.use('/api/sales-returns', salesReturnRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/quotations", quotationRoutes);
// Example route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Example: get all companies
app.get("/companies", async (req, res) => {
  const companies = await prisma.companies.findMany();
  res.json(companies);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
