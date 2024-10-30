// backend/controllers/gemini.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Inicialize o cliente com sua chave de API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Função de Chat para gerenciar interações múltiplas
export const geminiChat = async (req, res) => {
    const { question } = req.body;
    try {
        // Inicie o modelo de chat com suporte a múltiplos turnos
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Olá, estou aqui para ajudar!" }],
                },
            ],
        });

        // Envie a mensagem do usuário para o chat
        const result = await chat.sendMessage(question);
        const response = await result.response;
        const text = response.text();

        // Retorne a resposta para o frontend
        res.json({ answer: text });
    } catch (error) {
        console.error("Erro na API do Gemini:", error);
        res.status(500).json({ error: "Erro ao obter resposta do Gemini" });
    }
};
