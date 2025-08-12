import express from "express";

import { 
    createCredential, 
    createWebhook, 
    verifyCredential , 
    verifyWebhook, 
    pingStatus 
} from "../controllers/credentialController.js";

import { authenticateUser, orgValidation} from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/create",  authenticateUser,orgValidation, createCredential);
router.post("/verify",  authenticateUser, orgValidation, verifyCredential);

router.post("/create/webhook", createWebhook);
router.post("/verify/webhook", verifyWebhook);

router.put("/ping/:stateId", authenticateUser, orgValidation, pingStatus);

export default router;