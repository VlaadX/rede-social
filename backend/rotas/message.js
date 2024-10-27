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

router.get("/unread/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        // Encontra conversas onde o usuário recebeu mensagens não lidas
        const unreadConversations = await Message.aggregate([
            { 
                $match: { 
                    isRead: false,               // Mensagens não lidas
                    authorId: { $ne: userId }    // Que não foram enviadas pelo próprio usuário
                } 
            },
            { 
                $group: { 
                    _id: "$room"                // Agrupar por sala de conversa
                } 
            }
        ]);

        const unreadRooms = unreadConversations.map((conv) => conv._id);
        res.json(unreadRooms);
    } catch (error) {
        console.error("Erro ao buscar mensagens não lidas:", error);
        res.status(500).json({ error: "Erro ao buscar mensagens não lidas" });
    }
});






export default router;
