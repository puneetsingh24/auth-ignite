import express from "express";
import { createOrg, sendInvitation } from "../controllers/orgController.js";
import { authenticateUser } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/",  authenticateUser, createOrg);
router.post("/invite",  authenticateUser, sendInvitation);

export default router;
