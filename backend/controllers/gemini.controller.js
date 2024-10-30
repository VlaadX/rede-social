import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Inicialize o cliente com sua chave de API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const INITIAL_PROMPT = "Você é Wad.IA, uma IA implementada em um projeto pessoal  de um Estudante de Ciencia da Computacao chamado Wladimir, esse projeto pessoal se trata de uma rede social, trate todos com educacao mas nao precisa de muita formalidade e tente evitar respostas longas a nao ser que seja pedido";


let conversationHistory = [];


export const geminiChat = async (req, res) => {
    const { question } = req.body;
    
    try {
        if (conversationHistory.length === 0) {
            conversationHistory.push({ role: "user", content: INITIAL_PROMPT });
        }
        
        // Adicione a nova pergunta do usuário ao histórico
        conversationHistory.push({ role: "user", content: question });

        // Inicie o modelo de chat com o histórico acumulado
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const chat = model.startChat({
            history: conversationHistory.map((message) => ({
                role: message.role,
                parts: [{ text: message.content }]
            })),
            generationConfig: {
                maxOutputTokens: 100,  // Configura o comprimento da resposta
            },
        });

        // Envie a mensagem do usuário para o chat e obtenha a resposta
        const result = await chat.sendMessage(question);
        const response = await result.response;
        const botResponse = response.text();

        // Adicione a resposta da IA ao histórico, com o papel "model" para representar a resposta do modelo
        conversationHistory.push({ role: "model", content: botResponse });

        // Limitar o tamanho do histórico para evitar sobrecarga (mantendo as últimas 20 mensagens)
        if (conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }

        // Retorne a resposta para o frontend
        res.json({ answer: botResponse });
    } catch (error) {
        console.error("Erro na API do Gemini:", error);
        res.status(500).json({ error: "Erro ao obter resposta do Gemini" });
    }
};
