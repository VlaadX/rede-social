import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react"; // Adicionado useState

import useFollow from "../hooks/useFollow";

const FollowersPage = () => {
    const navigate = useNavigate();
    const { username, tab } = useParams(); // Recebe o username e tab da URL
    const { follow, isPending } = useFollow();

    const [feedType, setFeedType] = useState("followers");

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
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
        enabled: !!authUser, // Espera authUser carregar antes de buscar seguidores
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const listToShow = tab === "seguindo" ? following : followers;

    return (
        <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
            {/* Cabeçalho Fixo */}
            <div className="sticky top-0 bg-black z-10 flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center">
                    <Link to="/" className="text-white mr-4">
                        &larr;
                    </Link>
                    <div>
                        <h2 className="font-bold text-lg">{authUser.fullName}</h2>
                        <p className="text-sm text-gray-500">@{authUser.username}</p>
                    </div>
                </div>
            </div>

            {/* Navegação entre Seguidores e Seguindo */}
            <div className='flex w-full border-b border-gray-700 mt-4'>
                <div
                    className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
                    onClick={() => setFeedType("following") || navigate(`/profile/${username}/following`)}
                >
                    Seguindo
                    {feedType === "following" && (
                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                    )}
                </div>
                <div
                    className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
                    onClick={() => setFeedType("followers" || navigate(`/profile/${username}/followers`))}
                >
                    Seguidores
                    {feedType === "followers" && (
                        <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
                    )}
                </div>
            </div>

            {/* Lista de Seguidores ou Seguindo */}
            <div className="space-y-2 pt-2 px-4">
                {listToShow && listToShow.length > 0 ? (
                    listToShow.map((user) => (
                        <div key={user._id} className="flex items-start justify-between py-2">
                            <div className="flex items-center">
                                <img
                                    src={user.profileImg || "/avatar-placeholder.png"}
                                    alt={user.fullName}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <Link to={`/profile/${user.username}`}>
                                        <h3 className="text-md font-semibold text-white">{user.fullName}</h3>
                                        <p className="text-sm text-gray-400">@{user.username}</p>
                                    </Link>
                                    <p className="text-xs text-gray-500">{user.bio || "No bio available"}</p>
                                    {user.isFollowing && <span className="text-xs text-blue-500">Segue você</span>}
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">Nenhum usuário encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default FollowersPage;
