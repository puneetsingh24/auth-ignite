import express from "express";

import { 
    listInvitations, 
    resendInvitation , 
    revokeInvitation 
} from "../controllers/invitationController.js";

import { authenticateUser, orgValidation} from '../middleware/authMiddleware.js';


const router = express.Router();

router.get("/",  authenticateUser,orgValidation, listInvitations);
router.put("/{invitationId}",  authenticateUser, orgValidation, resendInvitation);
router.delete("/{invitationId}",  authenticateUser, orgValidation, revokeInvitation);

export default router;