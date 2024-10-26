import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
	room: { type: String, required: true }, // Identificador único para a sala de chat (ex.: combinação dos IDs de ambos os usuários)
	authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	content: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);
export default Message;
