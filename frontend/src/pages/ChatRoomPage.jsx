import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FaArrowLeft } from "react-icons/fa"; // Importa o ícone de seta

const socket = io("https://rede-social-p1fh.onrender.com");

const ChatRoomPage = ({ authUser }) => {
	const { username } = useParams();
	const navigate = useNavigate(); // Hook para navegação
	const [messages, setMessages] = useState([]);
	const [currentMessage, setCurrentMessage] = useState("");
	const [recipient, setRecipient] = useState(null);

	const userId = authUser._id;
	const userName = authUser.username;

	const messagesContainerRef = useRef(null);

	useEffect(() => {
		const fetchRecipientData = async () => {
			const res = await fetch(`/api/users/profile/${username}`);
			const data = await res.json();
			setRecipient(data);
		};
		fetchRecipientData();
	}, [username]);

	useEffect(() => {
		if (!recipient) return;

		const roomId = [userId, recipient._id].sort().join("_");

		const fetchMessages = async () => {
			const res = await fetch(`/api/messages/${roomId}?limit=50&skip=0`);
			const data = await res.json();
			setMessages(data);

			// Rola para o final após o carregamento inicial das mensagens
			if (messagesContainerRef.current) {
				setTimeout(() => {
					messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
				}, 100); // Aguardar o render completo
			}
		};

		fetchMessages();

		socket.emit("join_room", { userId, targetUserId: recipient._id });

		const handleReceiveMessage = (data) => {
			setMessages((prevMessages) => [...prevMessages, data]);

			// Rola para o final ao receber uma nova mensagem
			if (messagesContainerRef.current) {
				messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
			}
		};

		socket.on("receive_message", handleReceiveMessage);

		return () => {
			socket.off("receive_message", handleReceiveMessage);
			socket.emit("leave_room", roomId);
		};
	}, [userId, recipient]);

	const sendMessage = () => {
		if (currentMessage.trim() === "") return;

		const messageData = {
			room: [userId, recipient._id].sort().join("_"),
			authorId: userId,
			authorName: userName,
			content: currentMessage,
			timestamp: new Date(),
		};

		socket.emit("send_message", messageData);

		setMessages((prevMessages) => [...prevMessages, messageData]);
		setCurrentMessage("");

		// Rola para o final ao enviar uma nova mensagem
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
		}
	};

	return (
		<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen flex flex-col bg-black'>
			{recipient && (
				<div className='flex items-center gap-4 p-4 border-b border-gray-700'>
					{/* Botão de Voltar */}
					<button onClick={() => navigate(-1)} className='text-white'>
						<FaArrowLeft className='w-5 h-5' />
					</button>
					<img
						src={recipient.profileImg || "/avatar-placeholder.png"}
						alt={recipient.fullName}
						className='w-10 h-10 md:w-12 md:h-12 rounded-full'
					/>
					<div>
						<p className='font-bold text-white text-sm md:text-base'>{recipient.fullName}</p>
						<p className='text-xs text-gray-400 md:text-sm'>@{recipient.username}</p>
					</div>
				</div>
			)}

			<div
				ref={messagesContainerRef}
				className='flex-1 overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-4'
				style={{ paddingBottom: "80px" }}
			>
				{messages.map((msg) => (
					<div
						key={msg._id}
						className={`flex items-end gap-2 ${
							msg.authorId === userId ? "justify-end" : "justify-start"
						}`}
					>
						{msg.authorId !== userId && (
							<img
								src={recipient?.profileImg || "/avatar-placeholder.png"}
								alt={recipient?.fullName || "User"}
								className='w-6 h-6 md:w-8 md:h-8 rounded-full'
							/>
						)}
						<div>
							<div
								className={`p-2 md:p-3 rounded-xl max-w-[70%] md:max-w-xs ${
									msg.authorId === userId ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
								}`}
							>
								<p className='text-xs md:text-sm'>{msg.content}</p>
							</div>
							<span className='text-[10px] text-gray-400 mt-1 md:text-xs'>
								{new Date(msg.timestamp).toLocaleDateString()}{" "}
								{new Date(msg.timestamp).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
						{msg.authorId === userId && (
							<img
								src={authUser.profileImg || "/avatar-placeholder.png"}
								alt={authUser.fullName}
								className='w-6 h-6 md:w-8 md:h-8 rounded-full'
							/>
						)}
					</div>
				))}
			</div>

			{/* Caixa de envio fixa */}
			<div className='sticky bottom-0 p-3 md:p-4 border-t border-gray-700 bg-black flex'>
				<input
					type='text'
					value={currentMessage}
					onChange={(e) => setCurrentMessage(e.target.value)}
					placeholder='Digite sua mensagem...'
					className='flex-1 p-2 md:p-3 rounded-l-full bg-gray-900 text-white border-none focus:outline-none text-xs md:text-sm'
				/>
				<button onClick={sendMessage} className='bg-blue-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-r-full text-xs md:text-sm'>
					Enviar
				</button>
			</div>
		</div>
	);
};

export default ChatRoomPage;
