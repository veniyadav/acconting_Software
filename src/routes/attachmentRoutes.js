// src/routes/attachmentRoutes.js
import express from "express";
import {
  createAttachment,
  getAllAttachments,
  getAttachmentById,
  updateAttachment,
  deleteAttachment,
} from "../controllers/attachmentController.js";

const router = express.Router();

// CRUD Routes for Attachments
router.post("/", createAttachment);           // POST   /api/attachments
router.get("/", getAllAttachments);           // GET    /api/attachments
router.get("/:id", getAttachmentById);        // GET    /api/attachments/123
router.put("/:id", updateAttachment);         // PUT    /api/attachments/123
router.delete("/:id", deleteAttachment);      // DELETE /api/attachments/123

export default router;