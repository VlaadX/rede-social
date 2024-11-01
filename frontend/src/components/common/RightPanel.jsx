import { Link, useNavigate } from "react-router-dom";
import { useQuery, } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";
import {   useState } from "react";

const RightPanel = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault(); 
			if (searchQuery.trim()) {
				navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
			}
		}
	};


	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			const res = await fetch("/api/users/suggested");
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong!");
			}
			return data;
		},
	});

	const { follow, isPending } = useFollow();

	if (suggestedUsers?.length === 0) return <div className='lg:w-64 w-0'></div>;

	return (
		<div className='hidden lg:block my-4 mx-2'>
			{/* Conteúdo do painel */}
			<form className="p-2 rounded-md sticky border border-black">
				<div className="relative">
				<input
				type="text"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				onKeyDown={handleSearchKeyDown}
				placeholder="Buscar..."
				className="block w-full p-2 text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-full"
			/>		</div>
			</form>

			<div className='p-4 rounded-md sticky top-2 border border-gray-700'>
				<p className='font-bold mb-2'>Quem seguir</p>
				<div className='flex flex-col gap-4'>
					{isLoading ? (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					) : (
						suggestedUsers?.map((user) => (
							<Link to={`/profile/${user.username}`} className='flex items-center justify-between gap-4' key={user._id}>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} alt="Profile" />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
									>
										{isPending ? <LoadingSpinner size='sm' /> : "Seguir"}
									</button>
								</div>
							</Link>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default RightPanel;
