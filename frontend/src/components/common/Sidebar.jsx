import { BiChat, BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoNotificationsOutline } from "react-icons/io5";
import { TbHexagonLetterW } from "react-icons/tb";
import { GrHomeRounded } from "react-icons/gr";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const location = useLocation(); // Usado para determinar a rota atual
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const isActive = (path) => location.pathname === path;

	return (
		<>
			{/* Sidebar para telas maiores */}
			<div className='hidden md:flex md:flex-[2_2_0] w-18 max-w-52'>
				<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
					<ul className='flex flex-col gap-3 mt-4'>
						<li className='flex justify-center md:justify-start'>
							<Link
								to='/'
								className={`flex gap-3 items-center ${
									isActive("/") ? "bg-stone-900" : "hover:bg-stone-900"
								} transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer`}
							>
								<GrHomeRounded className='w-6 h-6' />
								<span className='text-lg hidden md:block'>Inicio</span>
							</Link>
						</li>
						<li className='flex justify-center md:justify-start'>
							<Link
								to='/notifications'
								className={`flex gap-3 items-center ${
									isActive("/notifications") ? "bg-stone-900" : "hover:bg-stone-900"
								} transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer`}
							>
								<IoNotificationsOutline className='w-6 h-6' />
								<span className='text-lg hidden md:block'>Notificações</span>
							</Link>
						</li>

						<li className='flex justify-center md:justify-start'>
							<Link
								to={`/profile/${authUser?.username}`}
								className={`flex gap-3 items-center ${
									isActive(`/profile/${authUser?.username}`) ? "bg-stone-900" : "hover:bg-stone-900"
								} transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer`}
							>
								<CgProfile className='w-6 h-6' />
								<span className='text-lg hidden md:block'>Perfil</span>
							</Link>
						</li>

						<li className='flex justify-center md:justify-start'>
							<Link
								to='/chat'
								className={`flex gap-3 items-center ${
									isActive("/chat") ? "bg-stone-900" : "hover:bg-stone-900"
								} transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer`}
							>
								<BiChat className='w-6 h-6' />
								<span className='text-lg hidden md:block'>Chats</span>
							</Link>
						</li>
						<li className='flex justify-center md:justify-start'>
							<Link
								to='/ia'
								className={`flex gap-3 items-center ${
									isActive("/ia") ? "bg-stone-900" : "hover:bg-stone-900"
								} transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer`}
							>
								<TbHexagonLetterW className='w-6 h-6' />
								<span className='text-lg hidden md:block'>Wad.IA</span>
							</Link>
						</li>
					</ul>
					{authUser && (
						<Link
							to={`/profile/${authUser.username}`}
							className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
						>
							<div className='avatar hidden md:inline-flex'>
								<div className='w-8 rounded-full'>
									<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
								</div>
							</div>
							<div className='flex justify-between flex-1'>
								<div className='hidden md:block'>
									<p className='text-white font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
									<p className='text-slate-500 text-sm'>@{authUser?.username}</p>
								</div>
								<BiLogOut
									className='w-5 h-5 cursor-pointer'
									onClick={(e) => {
										e.preventDefault();
										logout();
									}}
								/>
							</div>
						</Link>
					)}
				</div>
			</div>

			{/* Barra inferior para telas menores */}
			<div className='fixed bottom-0 left-0 right-0 flex justify-around bg-black p-2 border-t border-gray-700 md:hidden'>
				<Link to='/'>
					<GrHomeRounded className={`w-6 h-6 ${isActive("/") ? "text-blue-500" : "text-white"}`} />
				</Link>
				<Link to='/notifications'>
					<IoNotificationsOutline
						className={`w-6 h-6 ${isActive("/notifications") ? "text-blue-500" : "text-white"}`}
					/>
				</Link>
				<Link to={`/profile/${authUser?.username}`}>
					<CgProfile
						className={`w-6 h-6 ${isActive(`/profile/${authUser?.username}`) ? "text-blue-500" : "text-white"}`}
					/>
				</Link>
				<Link to='/chat'>
					<BiChat className={`w-6 h-6 ${isActive("/chat") ? "text-blue-500" : "text-white"}`} />
				</Link>
				<Link to='/ia'>
					<TbHexagonLetterW className={`w-6 h-6 ${isActive("/ia") ? "text-blue-500" : "text-white"}`} />
				</Link>
				<BiLogOut
					className='w-6 h-6 text-white cursor-pointer'
					onClick={(e) => {
						e.preventDefault();
						logout();
					}}
				/>
			</div>
		</>
	);
};

export default Sidebar;
