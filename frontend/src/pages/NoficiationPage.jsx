import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import Sidebar from "../components/common/Sidebar"; 

const NotificationPage = () => {
	const queryClient = useQueryClient();
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className=' flex-[4_4_0] border-r border-gray-700 lg:flex-row min-h-screen overflow-hidden'>

			<div className='flex-1 lg:max-w-[800px] w-full mx-auto border-l border-r border-gray-700 min-h-screen px-4 md:px-8'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold text-lg md:text-xl'>Notificações</p>
					<div className='dropdown'>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-5 h-5 md:w-6 md:h-6' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Apagar todas as notificações</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading ? (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				) : notifications?.length === 0 ? (
					<div className='text-center p-4 font-bold text-lg md:text-xl'>
						Sem Notificações 🤔
					</div>
				) : (
					notifications.map((notification) => (
						<div className='border-b border-gray-700 p-4' key={notification._id}>
							<div className='flex gap-4 items-center'>

								{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
								{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
								

								<Link to={`/profile/${notification.from.username}`} className='flex gap-3 items-center'>
									<div className='avatar'>
										<div className='w-10 h-10 rounded-full'>
											<img src={notification.from.profileImg || "/avatar-placeholder.png"} alt="Profile" />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-bold text-sm md:text-base'>
											@{notification.from.username}
										</span>
										<span className='text-xs md:text-sm text-gray-400'>
											{notification.type === "follow" ? "seguiu você" : "curtiu seu post"}
										</span>
									</div>
								</Link>
							</div>
						</div>
					))
				)}
			</div>


			<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 lg:hidden">
				<Sidebar />
			</div>
		</div>
	);
};

export default NotificationPage;
