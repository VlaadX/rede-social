import { useState } from "react";
import { FaArrowUp, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const IAPage = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        setLoading(true);
        try {
            const response = await fetch("/api/gemini/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ question })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Erro ao buscar resposta");

            setMessages((prevMessages) => [
                ...prevMessages,
                { role: "user", content: question },
                { role: "bot", content: data.answer }
            ]);

            setQuestion("");
            setShowChat(true);
        } catch (error) {
            console.error("Erro ao buscar resposta:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-[4_4_0] border-l border-r border-gray-700 min-h-screen flex-col bg-black-900 text-white px-4">
            {/* Barra Superior */}
            <div className="w-full max-w-lg  fixed top-1  flex items-center p-3 bg-black-800 border-b  border-gray-700 ">
                <button onClick={() => navigate(-1)} className="text-gray-300 hover:text-white mr-3">
                    <FaArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-white">Conversando com Wad.IA</h2>
                <span className="ml-auto text-gray-400 italic text-sm">Assista à mágica acontecer!</span>
            </div>

            <div className="pt-20 w-full flex flex-col items-center justify-center min-h-[calc(100vh-60px)]">
                {!showChat ? (
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl font-bold mb-4">Em que posso ajudar?</h1>
                        <div className="flex items-center bg-black-800 rounded-full px-4 py-3 w-full max-w-md mb-8 shadow-md">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Mensagem para Wad.IA"
                                className="flex-1 bg-transparent text-white outline-none border-b border-gray-700 placeholder-gray-400 px-2"
                                onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                            />
                            <button onClick={handleAskQuestion} disabled={loading} className="text-gray-500 ml-3 hover:text-white">
                                <FaArrowUp className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-lg flex flex-col bg-black-800 rounded-lg shadow-lg h-full relative pt-4">
                        {/* Área de mensagens */}
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 pr-2">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`p-3 rounded-xl max-w-xs ${
                                        msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"
                                    } shadow`}>
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {loading && <p className="text-gray-400 text-center">Aguarde, Wad.IA está pensando...</p>}
                        </div>

                        {/* Campo de entrada fixo */}
                        <div className="sticky bottom-0 p-3 md:p-4 border-t border-gray-700 bg-black flex">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-transparent text-white outline-none placeholder-gray-400 px-2"
                                onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                            />
                            <button onClick={handleAskQuestion} disabled={loading} className="text-gray-500 ml-3 hover:text-white">
                                <FaArrowUp className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IAPage;
