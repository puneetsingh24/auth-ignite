import express from "express";
import { createOrg, sendInvitation, getOrgMembers } from "../controllers/orgController.js";
import { authenticateUser, orgValidation} from '../middleware/authMiddleware.js';


const router = express.Router();

router.post("/",  authenticateUser, createOrg);
router.post("/invite",  authenticateUser, orgValidation, sendInvitation);
router.get("/members",  authenticateUser, orgValidation, getOrgMembers);

export default router;
