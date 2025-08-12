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

router.put("/ping/:requestId", authenticateUser, orgValidation, pingStatus);

export default router;