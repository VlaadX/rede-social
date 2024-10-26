import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

const ChatRoomPage = ({ authUser }) => {
	const { username } = useParams();
	const [messages, setMessages] = useState([]);
	const [currentMessage, setCurrentMessage] = useState("");
	const [recipient, setRecipient] = useState(null);
	const [hasMoreMessages, setHasMoreMessages] = useState(true); // Controle para carregamento de mais mensagens
	const [skip, setSkip] = useState(0);

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
			const res = await fetch(`/api/messages/${roomId}?limit=50&skip=${skip}`);
			const data = await res.json();
			setMessages((prevMessages) => [...data, ...prevMessages]);
			setHasMoreMessages(data.length === 50); // Se retornou menos que o limite, não há mais mensagens
		};
		fetchMessages();

		socket.emit("join_room", { userId, targetUserId: recipient._id });

		const handleReceiveMessage = (data) => {
			if (data.authorId !== userId) {
				setMessages((prevMessages) => [...prevMessages, data]);
			}
		};

		socket.on("receive_message", handleReceiveMessage);

		return () => {
			socket.off("receive_message", handleReceiveMessage);
			socket.emit("leave_room", roomId);
		};
	}, [userId, recipient, skip]);

	useEffect(() => {
		// Inicia o scroll no final ao carregar as mensagens mais recentes
		if (messagesContainerRef.current && skip === 0) {
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
		}
	}, [messages]);

	// Função para carregar mais mensagens ao rolar para o topo
	const handleScroll = () => {
		if (messagesContainerRef.current.scrollTop === 0 && hasMoreMessages) {
			setSkip((prevSkip) => prevSkip + 50); // Carregar mais mensagens anteriores
		}
	};

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
	};

	return (
		<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen flex flex-col bg-black'>
			{recipient && (
				<div className='flex items-center gap-4 p-4 border-b border-gray-700'>
					<img
						src={recipient.profileImg || "/avatar-placeholder.png"}
						alt={recipient.fullName}
						className='w-12 h-12 rounded-full'
					/>
					<div>
						<p className='font-bold text-white'>{recipient.fullName}</p>
						<p className='text-sm text-gray-400'>@{recipient.username}</p>
					</div>
				</div>
			)}

			<div
				ref={messagesContainerRef}
				onScroll={handleScroll}
				className='flex-1 overflow-y-auto p-4 space-y-4'
			>
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`flex ${
							msg.authorId === userId ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`p-3 rounded-xl max-w-[75%] ${
								msg.authorId === userId ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
							}`}
						>
							{msg.authorId !== userId && (
								<p className='text-xs font-semibold text-gray-300 mb-1'>{msg.authorName}</p>
							)}
							<p className='text-sm'>{msg.content}</p>
							<span className='text-xs text-gray-400'>
								{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
							</span>
						</div>
					</div>
				))}
			</div>

			<div className='p-4 border-t border-gray-700 bg-gray-800 flex'>
				<input
					type='text'
					value={currentMessage}
					onChange={(e) => setCurrentMessage(e.target.value)}
					placeholder='Digite sua mensagem...'
					className='flex-1 p-3 rounded-l-full bg-gray-900 text-white border-none focus:outline-none'
				/>
				<button onClick={sendMessage} className='bg-blue-500 text-white px-4 py-2 rounded-r-full'>
					Enviar
				</button>
			</div>
		</div>
	);
};

export default ChatRoomPage;
