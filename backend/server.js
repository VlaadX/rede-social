import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { v2 as cloudinary } from "cloudinary";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./rotas/auth.js";
import userRoutes from "./rotas/user.js";
import postRoutes from "./rotas/posts.js";
import notificationRoutes from "./rotas/notification.js";

import connectMongoDB from "./db/connectMongo.js";
import Message from "./models/message.model.js";
import messageRoutes from "./rotas/message.js";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://rede-social-p1fh.onrender.com", ], // Permitir localhost e produção
        methods: ["GET", "POST", "DELETE"],
        credentials: true,
    },
});

const __dirname = path.resolve();

app.use(express.json({ limit: "7mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuração das rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

// Configuração do Socket.IO para o Chat
io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);

    // Evento para o usuário entrar em uma sala de chat específica
    socket.on("join_room", async ({ userId, targetUserId }) => {
        // Criar uma sala única para a conversa entre os dois usuários
        const roomId = [userId, targetUserId].sort().join("_"); // Ex: "user1_user2" para chats entre user1 e user2
        socket.join(roomId);
        console.log(`Usuário ${socket.id} entrou na sala ${roomId}`);
    });
	
    // Evento para envio de mensagem
    socket.on("send_message", async (data) => {
        const { room, authorId, authorName, content, timestamp } = data;

        // Salvar a mensagem no banco de dados
        const newMessage = new Message({ room, authorId, content, timestamp });
        await newMessage.save();

        // Enviar a mensagem para a sala específica, excluindo o remetente
        socket.to(room).emit("receive_message", newMessage);
    });

    // Evento de desconexão do usuário
    socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.id);
    });
});


// Configuração para servir o frontend em produção
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend", "dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Porta dinâmica para compatibilidade com o Render
const PORT = process.env.PORT || 8000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ON na porta ${PORT}`);
    connectMongoDB();

});

