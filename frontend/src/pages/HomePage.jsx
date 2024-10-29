import { useState } from "react";
import Posts from "../components/common/Posts.jsx";
import CreatePost from "./CreatePost";
import RightPanel from "../components/common/RightPanel";
import Sidebar from "../components/common/Sidebar"; // A barra lateral inferior

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<div className='flex flex-col lg:flex-row min-h-screen overflow-hidden'>
			{/* Conteúdo Principal */}
			<div className='flex-1 lg:max-w-[600px] w-full mx-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative ${
							feedType === "forYou" ? "font-bold text-primary" : "text-gray-500"
						}`}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative ${
							feedType === "following" ? "font-bold text-primary" : "text-gray-500"
						}`}
						onClick={() => setFeedType("following")}
					>
						Seguindo
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/* Create Post Input */}
				<div className="px-2 md:px-4">
					<CreatePost />
				</div>

				{/* Posts */}
				<div className="px-2 md:px-4">
					<Posts feedType={feedType} />
				</div>
			</div>


			{/* Barra Inferior Fixa para Dispositivos Móveis */}
			<div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 lg:hidden">
				<Sidebar />
			</div>
		</div>
	);
};

export default HomePage;
