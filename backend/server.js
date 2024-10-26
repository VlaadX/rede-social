import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./rotas/auth.js";
import userRoutes from "./rotas/user.js";
import postRoutes from "./rotas/posts.js";
import notificationRoutes from "./rotas/notification.js";

import connectMongoDB from "./db/connectMongo.js";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const __dirname = path.resolve();

app.use(express.json({ limit: "7mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Configuração para servir o frontend em produção
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "frontend", "build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Porta dinâmica para compatibilidade com o Render
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ON na porta ${PORT}`);
    connectMongoDB();
});

