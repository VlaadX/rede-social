import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Post from "../components/common/Post";

const SearchPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const queryParams = new URLSearchParams(location.search);
	const searchQuery = queryParams.get("query") || "";

	const [activeTab, setActiveTab] = useState("users");
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);

	useEffect(() => {

		// Função para buscar usuários com o termo no corpo
		const fetchUsers = async () => {
			const res = await fetch(`/api/users/search?query=${encodeURIComponent(searchQuery)}`);
			const data = await res.json();
			setUsers(data);
		};

		// Função para buscar posts com o termo no corpo
		const fetchPosts = async () => {
			const res = await fetch(`/api/posts/search?query=${encodeURIComponent(searchQuery)}`);
			const data = await res.json();
			setPosts(data);
  
		};

		if (searchQuery) {
			fetchUsers();
			fetchPosts();
		}
	}, [searchQuery]);

	return (
		<div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
		
			<div className="sticky top-0 z-10 flex border-b border-gray-700 bg-black">
				<button
					className={`flex-1 p-4 ${activeTab === "users" ? "border-b-2 border-blue-500" : ""}`}
					onClick={() => setActiveTab("users")}
				>
					Usuários
				</button>
				<button
					className={`flex-1 p-4 ${activeTab === "posts" ? "border-b-2 border-blue-500" : ""}`}
					onClick={() => setActiveTab("posts")}
				>
					Posts
				</button>
			</div>

			{/* Conteúdo da aba "Usuários" */}
			{activeTab === "users" && (
				<div className="p-4 lg:max-w-3xl mx-auto">
					{users.length > 0 ? (
						users.map((user) => (
							<div
								key={user._id}
								className="flex items-center gap-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition"
								onClick={() => navigate(`/profile/${user.username}`)}
							>
								<img
									src={user.profileImg || "/avatar-placeholder.png"}
									alt={user.username}
									className="w-12 h-12 rounded-full"
								/>
								<div>
									<p className="font-bold text-base">@{user.username}</p>
									<p className="text-sm text-gray-400">{user.fullName}</p>
                                    <p className="text-m text-white-400">{user.bio}</p>
								</div>
							</div>
						))
					) : (
						<p className="text-center text-gray-500">Nenhum usuário encontrado</p>
					)}
				</div>
			)}

			{/* Conteúdo da aba "Posts" */}
			{activeTab === "posts" && (
				<div className="p-4 lg:max-w-3xl mx-auto">
					{posts.length > 0 ? (
						posts.map((post) => (
							<Post key={post._id} post={post} searchTerm={searchQuery} /> // Reutilizando o componente Post
						))
					) : (
						<p className="text-center text-gray-500">Nenhum post encontrado</p>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchPage;
