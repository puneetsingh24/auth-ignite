import express from "express";

import { 
    verifyCredential,
    verifyWebhook,
    pingStatus
} from "../controllers/credentialController.js";

import { authenticateUser, orgValidation} from '../middleware/authMiddleware.js';


const router = express.Router();

// router.post("/create",  authenticateUser,orgValidation, createCredential);
router.post("/verify", verifyCredential);

// router.post("/create/webhook", createWebhook);
router.post("/webhook/verify", verifyWebhook);

router.get("/ping/:requestId", pingStatus);

export default router;