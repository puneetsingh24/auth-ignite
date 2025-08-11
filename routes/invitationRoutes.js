import express from "express";

import { 
    listInvitations, 
    resendInvitation , 
    revokeInvitation 
} from "../controllers/invitationController.js";

import { authenticateUser, orgValidation} from '../middleware/authMiddleware.js';


const router = express.Router();

router.get("/",  authenticateUser,orgValidation, listInvitations);
router.delete("/:invitationId",  authenticateUser, orgValidation, revokeInvitation);
router.put("/:invitationId",  authenticateUser, orgValidation, resendInvitation);

export default router;