import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFollow from "../hooks/useFollow";

const FollowingPage = () => {
    const navigate = useNavigate();
    const { username, tab } = useParams(); // Recebe o username da URL
    const { follow, isPending } = useFollow();
    const [feedType, setFeedType] = useState("following");

    // Query para buscar o usuário do perfil atual
    const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ["userProfile", username],
        queryFn: async () => {
            const res = await fetch(`/api/users/profile/${username}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            return data;
        },
        enabled: !!username,
    });

    const { data: following, isLoading } = useQuery({
        queryKey: ["following", username],
        queryFn: async () => {
            const res = await fetch(`/api/users/following/${username}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            return data;
        },
        enabled: !!username,
    });

    if (isLoading || isLoadingProfile) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const listToShow = following;

    return (
        <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
            {/* Cabeçalho Fixo */}
            <div className="sticky top-0 bg-black z-10 flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center">
                    <Link to="/" className="text-white mr-4">
                        &larr;
                    </Link>
                    <div>
                        {/* Exibe o nome e o username do perfil visualizado */}
                        <h2 className="font-bold text-lg">{userProfile?.fullName}</h2>
                        <p className="text-sm text-gray-500">@{userProfile?.username}</p>
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
                    onClick={() => setFeedType("followers") || navigate(`/profile/${username}/followers`)}
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
                                        <p className="text-s text-white-500">{user.bio || "No bio available"}</p>
                                    </Link>
                                </div>
                            </div>
                            <button className={`px-4 py-1 rounded-full text-sm font-semibold ${user.isFollowing ? "bg-gray-700 text-white" : "bg-white text-black"}`}>
                                {user.isFollowing ? "Seguindo" : "Seguir"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">Nenhum usuário encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default FollowingPage;
