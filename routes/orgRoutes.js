import express from "express";

import { 
    createOrg, 
    sendInvitation, 
    getOrgMembers, 
    deleteOrganization, 
    removeMember , 
    updateOrgMFA 
} from "../controllers/orgController.js";

import { authenticateUser, orgValidation} from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/",  authenticateUser, createOrg);
router.post("/invite",  authenticateUser, orgValidation, sendInvitation);
router.get("/members",  authenticateUser, orgValidation, getOrgMembers);
router.delete("/",  authenticateUser, orgValidation, deleteOrganization);
router.delete("/members/:uid",  authenticateUser, orgValidation, removeMember);
router.put("/mfa",  authenticateUser, orgValidation, updateOrgMFA);

export default router;
