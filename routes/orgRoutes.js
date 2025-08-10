import express from "express";
import { createOrg } from "../controllers/orgController.js";
import { authenticateUser } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/",  authenticateUser, createOrg);

export default router;
