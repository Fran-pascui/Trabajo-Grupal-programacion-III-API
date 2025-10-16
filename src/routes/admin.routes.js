import { Router } from "express";
import { verifyToken } from "../services/authMidleware.js";
import { emailAdminSearch } from "../services/sysadmin.services.js";
import express from "express";

export const router = express.Router();

router.post("/admin/searchemail", emailAdminSearch);
export default router;
