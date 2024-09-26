"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "@/components/ui/button";
import { useRenameModal } from "@/store/use-rename-modal";
import { Separator } from "./ui/separator";

interface ActionsProps {
	children: React.ReactNode;
	side?: DropdownMenuContentProps["side"];
	sideOffset?: DropdownMenuContentProps["sideOffset"];
	id: string;
	title: string;
}

export const BoardActions = ({
	children,
	id,
	side,
	sideOffset,
	title,
}: ActionsProps) => {
	const { onOpen } = useRenameModal();
	const { mutate, pending } = useApiMutation(api.board.remove);

	const onCopyLink = () => {
		navigator.clipboard
			.writeText(`${window.location.origin}/board/${id}`)
			.then(() => toast.success("Link copied to clipboard"))
			.catch(() => toast.error("Failed to copy link"));
	};

	const onDelete = () => {
		const promise = mutate({
			id,
		});
		toast.promise(promise, {
			loading: "Deleting your board...",
			success: "Board deleted successfully",
			error: "Failed to delete board",
		});
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent
				onClick={(e) => e.stopPropagation()}
				sideOffset={sideOffset}
				side={side}
				className="w-60"
			>
				<DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
					<Link2 className="size-4 mr-2" />
					Copy board link
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => onOpen(id, title)}
					className="p-3 cursor-pointer"
				>
					<Pencil className="size-4 mr-2" />
					Rename
				</DropdownMenuItem>
				<Separator />
				<ConfirmModal
					header="Delete board?"
					description="This will delete the board and all of its contents."
					disabled={pending}
					onConfirm={onDelete}
				>
					<Button
						variant="ghost"
						className="p-3 cursor-pointer text-sm w-full justify-start font-normal hover:bg-rose-400/40"
					>
						<Trash2 className="size-4 mr-2" />
						Delete
					</Button>
				</ConfirmModal>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
