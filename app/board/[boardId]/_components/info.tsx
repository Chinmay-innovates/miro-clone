"use client";
import { BoardActions } from "@/components/board-actions";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useRenameModal } from "@/store/use-rename-modal";
import { useQuery } from "convex/react";
import { Menu } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
interface InfoProps {
	boardId: string;
}

const font = Poppins({
	subsets: ["latin"],
	variable: "--font-poppins",
	weight: ["600"],
});

const TabSeparator = () => {
	return <div className="text-neutral-300 px-1.5">|</div>;
};

export const Info = ({ boardId }: InfoProps) => {
	const { onOpen } = useRenameModal();
	const data = useQuery(api.board.get, {
		id: boardId as Id<"boards">,
	});

	if (!data) return <InfoSkeleton />;

	return (
		<div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
			<Hint label="Go to boards" side="bottom" sideOffset={10}>
				<Button asChild className="px-2" variant="board">
					<Link href="/">
						<Image src="/logo.png" alt="Board logo" width={40} height={40} />
						<span
							className={cn(
								"font-semibold text-xl ml-2 text-black",
								font.className
							)}
						>
							Miro
						</span>
					</Link>
				</Button>
			</Hint>
			<TabSeparator />
			<Hint label="Edit title" side="bottom" sideOffset={10}>
				<Button
					variant="board"
					className="text-base font-normal px-2"
					onClick={() => onOpen(data._id, data.title)}
				>
					{data.title}
				</Button>
			</Hint>
			<TabSeparator />
			<BoardActions
				id={data._id}
				title={data.title}
				side="bottom"
				sideOffset={10}
			>
				<div>
					<Hint label="Main menu" side="bottom" sideOffset={10}>
						<Button variant="board" size="icon">
							<Menu />
						</Button>
					</Hint>
				</div>
			</BoardActions>
		</div>
	);
};
export const InfoSkeleton = () => {
	return (
		<div className="absolute top-2 left-2 bg-white rounded-md p-2 h-12 flex items-center shadow-md w-[300px]">
			<Skeleton className="h-full w-full bg-slate-300" />
		</div>
	);
};