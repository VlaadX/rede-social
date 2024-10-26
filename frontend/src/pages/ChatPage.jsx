import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Link } from "react-router-dom";

const ChatPage = () => {
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
		enabled: !!authUser, // Aguarda o carregamento de authUser antes de fazer a consulta
	});

	return (
		<>
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
								{followers.map((follower) => (
									<li key={follower._id} className='flex items-center gap-4'>
										<img
											src={follower.profileImg || "/avatar-placeholder.png"}
											alt={follower.username}
											className='w-12 h-12 rounded-full'
										/>
										<div>
											<p className='font-bold'>{follower.fullName}</p>
											<p className='text-sm text-gray-500'>@{follower.username}</p>
										</div>
										<Link
											to={`/chat/${follower.username}`} // Redireciona para a página de conversa com o seguidor
											className='ml-auto text-blue-500 hover:underline'
										>
											Iniciar Conversa
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default ChatPage;
