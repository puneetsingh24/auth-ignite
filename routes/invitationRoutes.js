import express from "express";

import { 
    listInvitations, 
    revokeInvitation 
} from "../controllers/invitationController.js";

import { authenticateUser, orgValidation} from '../middleware/authMiddleware.js';


const router = express.Router();

router.get("/",  authenticateUser,orgValidation, listInvitations);
router.put("/{invitationId}",  authenticateUser, orgValidation, revokeInvitation);
router.delete("/{invitationId}",  authenticateUser, orgValidation, revokeInvitation);

export default router;