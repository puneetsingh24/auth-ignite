import express from "express";
import { getUserConfig, createUser, fetchExternalData } from "../controllers/userController.js";

const router = express.Router();

router.get("/config", getUserConfig);
router.post("/", createUser);
router.get("/external", fetchExternalData);

export default router;
