import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ChatPage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const [unreadRooms, setUnreadRooms] = useState([]);
    
    // Fetching followers as usual
    const { data: following, isLoading } = useQuery({
        queryKey: ["following"],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/users/following/${authUser.username}`);
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
                setUnreadRooms(data); 
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

            {!isLoading && following && (
                <div className='p-4'>
                    {following.length === 0 ? (
                        <p className='text-center text-gray-500'>Você ainda não possui seguidores.</p>
                    ) : (
                        <ul className='space-y-4'>
                            {following.map((following) => {

                                return (
                                    <Link
                                        key={following._id}
                                        to={`/chat/${following.username}`} 
                                        className='flex items-center gap-3 p-1 rounded-lg hover:bg-black-800 cursor-pointer '
                                    >
                                        <img
                                            src={following.profileImg || "/avatar-placeholder.png"}
                                            alt={following.username}
                                            className='w-12 h-12 rounded-full'
                                        />
                                        <div>
                                            <p className='font-bold'>{following.fullName}</p>
                                            <p className='text-sm text-gray-500'>@{following.username}</p>
                                        </div>

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
