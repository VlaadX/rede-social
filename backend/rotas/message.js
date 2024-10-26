import express from "express";
import Message from "../models/message.model.js";

const router = express.Router();

// Rota para obter o histórico de mensagens de uma sala específica
router.get("/:roomId", async (req, res) => {
	try {
		const { roomId } = req.params;
		const messages = await Message.find({ room: roomId }).sort({ timestamp: 1 });
		res.status(200).json(messages);
	} catch (error) {
		console.error("Erro ao buscar histórico de mensagens:", error);
		res.status(500).json({ error: "Erro ao buscar histórico de mensagens" });
	}
});

export default router;
