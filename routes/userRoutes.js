import express from "express";
import { getUsers, createUser, fetchExternalData } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/external", fetchExternalData);

export default router;
