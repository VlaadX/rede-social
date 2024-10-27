import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ChatPage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const [unreadRooms, setUnreadRooms] = useState([]);
    
    // Fetching followers as usual
    const { data: followers, isLoading } = useQuery({
        queryKey: ["followers"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users/followers/${authUser.username}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Something went wrong");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        enabled: !!authUser, // Waits for authUser to load before fetching
    });

    // Fetching unread messages
    useEffect(() => {
        const fetchUnreadMessages = async () => {
            try {
                const res = await fetch(`/api/messages/unread/${authUser._id}`);
                const data = await res.json();
                setUnreadRooms(data); // Stores the room IDs with unread messages
            } catch (error) {
                console.error("Erro ao buscar mensagens não lidas:", error);
            }
        };

        if (authUser) {
            fetchUnreadMessages();
        }
    }, [authUser]);

    return (
        <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
            <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                <p className='font-bold'>Conversas</p>
            </div>

            {isLoading && (
                <div className='flex justify-center h-full items-center'>
                    <LoadingSpinner size='lg' />
                </div>
            )}

            {!isLoading && followers && (
                <div className='p-4'>
                    {followers.length === 0 ? (
                        <p className='text-center text-gray-500'>Você ainda não possui seguidores.</p>
                    ) : (
                        <ul className='space-y-4'>
                            {followers.map((follower) => {
                                // Determining if this follower has unread messages
                                const hasUnreadMessages = unreadRooms.includes(
                                    [authUser._id, follower._id].sort().join("_")
                                );

                                return (
                                    <Link
                                        key={follower._id}
                                        to={`/chat/${follower.username}`} // Navigates to the chat page with the follower
                                        className='flex items-center gap-4 p-4 rounded-lg hover:bg-gray-800 cursor-pointer'
                                    >
                                        <img
                                            src={follower.profileImg || "/avatar-placeholder.png"}
                                            alt={follower.username}
                                            className='w-12 h-12 rounded-full'
                                        />
                                        <div>
                                            <p className='font-bold'>{follower.fullName}</p>
                                            <p className='text-sm text-gray-500'>@{follower.username}</p>
                                        </div>
                                        {/* Display "Nova Mensagem" if there are unread messages */}
                                        {hasUnreadMessages && (
                                            <span className='ml-auto text-green-400 font-semibold text-sm'>
                                                Nova Mensagem
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatPage;
