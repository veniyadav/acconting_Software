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
import goodsReceiptRoutes from './src/routes/goodsReceiptRoutes.js';
import purchaseBillRoutes from './src/routes/purchaseBillRoutes.js'
import orderHeaderRoutes from './src/routes/orderHeaderRoutes.js'
import vendorPaymentRoutes from './src/routes/vendorPaymentRoutes.js'
import returnRoutes from './src/routes/returnRoutes.js'
import invoiceRoutes from './src/routes/invoiceRoutes.js'
import warehouseRoutes from './src/routes/warehouses.routes.js'
import vendorsRoutes from './src/routes/vendors.routes.js'
import expenseVoucherRoutes from './src/routes/expenseVoucherRoutes.js'
import attachmentRoutes from "./src/routes/attachmentRoutes.js";
import receiptRoutes from "./src/routes/receiptRoutes.js";
import ewayBillRoutes from "./src/routes/ewayBillRoutes.js";
import incomeVoucherRoutes from './src/routes/incomeVoucherRoutes.js';
import contraVoucherRoutes from './src/routes/contraVoucherRoutes.js';
import voucherRoutes from './src/routes/voucherRoutes.js';
import deliveryChallanRoutes from "./src/routes/deliveryChallanRoutes.js";
import userRoutes from "./src/routes/userRoutes (1).js";
import permissionRoutes from "./src/routes/permissionRoutes.js";
import roleRoutes from "./src/routes/roleRoutes.js";
import rolePermissionRoutes from "./src/routes/rolePermissionRoutes.js";

import moduleRoutes from "./src/routes/moduleRoutes.js";
import planRoutes from "./src/routes/planRoutes.js";
import requestedPlanRoutes from "./src/routes/requestedPlanRoutes.js";
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
app.use('/api/goods-receipts', goodsReceiptRoutes);
app.use('/api/purchase-bills', purchaseBillRoutes);
app.use('/api/order-headers', orderHeaderRoutes);
app.use('/api/vendor-payments', vendorPaymentRoutes);
app.use('/api/returns', returnRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/vendors", vendorsRoutes);
app.use('/api/expense-vouchers', expenseVoucherRoutes);
app.use("/api/attachments", attachmentRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/eway-bills", ewayBillRoutes);
app.use('/api/income-vouchers', incomeVoucherRoutes);
app.use('/api/contra-vouchers', contraVoucherRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use("/api/delivery-challans", deliveryChallanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/role-permissions", rolePermissionRoutes);

app.use("/api/modules", moduleRoutes);

app.use("/api/plans", planRoutes);
app.use("/api/requested-plans", requestedPlanRoutes);
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
