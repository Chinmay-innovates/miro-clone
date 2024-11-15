"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const EmptyBoards = () => {
	const router = useRouter();
	const { mutate, pending } = useApiMutation(api.board.create);
	const { organization } = useOrganization();
	const onClick = () => {
		if (!organization) return;

		const promise = mutate({
			orgId: organization.id,
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
		<div className="h-full flex flex-col items-center justify-center">
			<Image src="/note.svg" alt="Empty boards" width={110} height={110} />
			<h2 className="text-2xl font-bold mt-6">Create your first board!</h2>
			<p className="text-muted-foreground mt-2 text-sm">
				Start by creating a board for your organization
			</p>
			<div className="mt-6">
				<Button disabled={pending} onClick={onClick} size="lg">
					Create board
				</Button>
			</div>
		</div>
	);
};
