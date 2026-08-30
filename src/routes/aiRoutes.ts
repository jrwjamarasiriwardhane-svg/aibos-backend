import { Router } from "express";
import { chatWithAi } from "../controllers/aiController";

const router = Router();

// POST /api/ai/chat
router.post("/chat", chatWithAi);

export default router;
