"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateBoardButtonProps {
	orgId: string;
	disabled?: boolean;
}

export const CreateBoardButton = ({
	orgId,
	disabled,
}: CreateBoardButtonProps) => {
	const router = useRouter();
	const { mutate, pending } = useApiMutation(api.board.create);
	const onClick = () => {
		if (!orgId) return;

		const promise = mutate({
			orgId: orgId,
			title: "Untitled",
		}).then((boardId) => {
			router.push(`/board/${boardId}`);
		});
		toast.promise(promise, {
			loading: "Creating your board...",
			success: "Board created successfully",
			error: "Failed to create board",
		});
	};
	return (
		<button
			disabled={disabled || pending}
			onClick={onClick}
			className={cn(
				"col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
				(disabled || pending) &&
					"opacity-75 cursor-not-allowed hover:bg-blue-600"
			)}
		>
			<div />
			<Plus className="size-12 stroke-1 text-white" />
			<p className="text-xs text-white font-light">New board</p>
		</button>
	);
};
