import express from "express";

import { 
    verifyCredential,
    verifyWebhook,
    pingStatus,
    createCredential
} from "../controllers/credentialController.js";

import { authenticateUser, orgValidation} from '../middleware/authMiddleware.js';


const router = express.Router();

router.get("/create", authenticateUser, createCredential);
router.post("/verify", verifyCredential);

//router.post("/webhook/create", createWebhook);
router.post("/webhook/verify", verifyWebhook);

router.get("/ping/:requestId", pingStatus);

export default router;