import express from "express";
import { getUserOrgsAndRoles } from "../controllers/userController.js";
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/config", authenticateUser, getUserOrgsAndRoles);

export default router;
