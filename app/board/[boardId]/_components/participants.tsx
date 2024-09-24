"use client";

import { UserAvatar } from "./user-avatar";
import { useOthers, useSelf } from "@/liveblocks.config";

import { Skeleton } from "@/components/ui/skeleton";
import { connectionIdToColor } from "@/lib/utils";

const MAX_SHOWN_USERS = 2;
export const Participants = () => {
	const users = useOthers();
	const currentUser = useSelf();
	const hasMoreUsers = users.length > MAX_SHOWN_USERS;

	return (
		<div className="absolute h-12 top-2 right-2 bg-white rounded-md p-2 flex items-center shadow-md">
			<div className="flex gap-x-2">
				{users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => (
					<UserAvatar
						key={connectionId}
						src={info?.picture as string}
						name={info?.name as string}
						fallback={info?.name?.[0] || "T"}
						borderColor={connectionIdToColor(connectionId)}
					/>
				))}

				{currentUser && (
					<UserAvatar
						src={currentUser.info?.picture as string}
						name={`${currentUser.info?.name} (You)`}
						fallback={currentUser.info?.name as string}
						borderColor={connectionIdToColor(currentUser.connectionId)}
					/>
				)}

				{hasMoreUsers && (
					<UserAvatar
						src=""
						name={`${users.length - MAX_SHOWN_USERS} more`}
						fallback={`+${users.length - MAX_SHOWN_USERS}`}
						borderColor=""
					/>
				)}
			</div>
		</div>
	);
};

export const ParticipantsSkeleton = () => {
	return (
		<div className="absolute h-12 top-2 right-2 bg-white rounded-md p-2 flex items-center shadow-md w-[100px]">
			<Skeleton className="h-full w-full bg-slate-300" />
		</div>
	);
};
