import { useRenameModal } from "@/store/use-rename-modal";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FormEventHandler, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export const RenameModal = () => {
	const { initialValues, isOpen, onClose } = useRenameModal();
	const { mutate, pending } = useApiMutation(api.board.update);

	const [title, setTitle] = useState(initialValues.title);

	useEffect(() => {
		setTitle(initialValues.title);
	}, [initialValues.title]);

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const promise = mutate({
			id: initialValues.id,
			title,
		})
			.then(() => onClose())
			.catch(() => toast.error("Title cannot be empty"));
		toast.promise(promise, {
			loading: "Renaming your board...",
			success: "Board renamed successfully",
			error: "Failed to rename board",
		});
	};
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit board title</DialogTitle>
				</DialogHeader>
				<DialogDescription>Enter a new title for this board</DialogDescription>
				<form onSubmit={onSubmit} className="space-y-4">
					<Input
						disabled={pending}
						maxLength={60}
						placeholder="Board Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={pending}>
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
