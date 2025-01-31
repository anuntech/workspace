import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/libs/api";
import { useQuery } from "@tanstack/react-query";
import { getS3Image } from "@/libs/s3-client";

import Image from "next/image";
import { IUser } from "@/models/User";

export function UserSearchInput({
	selectedUsers,
	setSelectedUsers,
	workspaceId,
	excludedUsers = [],
}: {
	selectedUsers: IUser[];
	setSelectedUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
	workspaceId: string;
	excludedUsers?: any[];
}) {
	const [query, setQuery] = useState("");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const membersQuery = useQuery({
		queryKey: ["workspace/members"],
		queryFn: () => api.get(`/api/workspace/members/${workspaceId}`),
	});

	const users = membersQuery.data?.data || [];

	const availableUsers = users
		.filter(
			(user: any) =>
				!selectedUsers.some((selected) => selected._id === user._id) &&
				!excludedUsers.some((excluded) => excluded.id === user._id) &&
				(user.name.toLowerCase().includes(query.toLowerCase()) ||
					user.email.toLowerCase().includes(query.toLowerCase())),
		)
		.filter((user: any) => user.role !== "admin");

	const handleSelectUser = (user: IUser) => {
		if (!selectedUsers.find((u) => u._id === user._id)) {
			setSelectedUsers((prev) => [...prev, user]);
			setQuery("");
		}
	};

	const handleRemoveUser = (userId: string) => {
		setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
	};

	return (
		<div className="relative w-full">
			<div className="flex flex-wrap gap-2 p-1 border rounded-md shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300 ease-in-out">
				{selectedUsers.map((user) => (
					<div
						key={user._id}
						className="flex items-center px-2 bg-blue-100 text-blue-800 rounded-full shadow-sm"
					>
						<span className="text-sm">{user.name}</span>
						<button
							className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
							onClick={() => handleRemoveUser(user._id)}
						>
							✕
						</button>
					</div>
				))}
				<Input
					placeholder="Selecione um usuário"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsDropdownOpen(true);
					}}
					onFocus={() => setIsDropdownOpen(true)}
					onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
					className="flex-1 min-w-[100px] border-none focus:ring-0 focus:outline-none shadow-none focus-visible:outline-none  focus-visible:ring-0"
					disabled={
						membersQuery.isPending ||
						membersQuery.isRefetching ||
						membersQuery.isFetching
					}
				/>
			</div>

			{isDropdownOpen && (
				<div className="absolute max-h-56 overflow-auto mt-2 w-full border bg-white rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out">
					{availableUsers.length > 0 ? (
						availableUsers.map((user: any) => (
							<div
								key={user._id}
								className={cn(
									"flex items-center px-4 py-2 space-x-3 hover:bg-blue-100 cursor-pointer transition-colors",
								)}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => handleSelectUser(user)}
							>
								{user.icon && (
									<div className="text-[1.3rem]">
										{user.icon.type == "emoji" ? (
											user.icon.value
										) : (
											<Image
												className="rounded-full"
												width={54}
												height={54}
												src={getS3Image(user.icon.value)}
												alt=""
											/>
										)}
									</div>
								)}
								{!user.icon && (
									<Avatar className="size-10">
										<AvatarImage
											src={user?.image || "/shad.png"}
											alt="@shadcn"
										/>
										<AvatarFallback>SC</AvatarFallback>
									</Avatar>
								)}

								<div className="flex flex-col">
									<span className="text-sm font-medium text-gray-800">
										{user.name}
									</span>
									<span className="text-xs text-gray-500">{user.email}</span>
								</div>
							</div>
						))
					) : (
						<div className="px-4 py-2 text-sm text-gray-500">
							Nenhum usuário encontrado
						</div>
					)}
				</div>
			)}
		</div>
	);
}
