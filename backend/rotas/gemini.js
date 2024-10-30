import express from "express";
import { geminiChat } from "../controllers/gemini.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();


router.post("/chat", protectRoute, geminiChat);

export default router;
