import express from "express";
import { getUserOrgsAndRoles, createUser, fetchExternalData } from "../controllers/userController.js";
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/config", authenticateUser, getUserOrgsAndRoles);
router.post("/", createUser);
router.get("/external", fetchExternalData);

export default router;
