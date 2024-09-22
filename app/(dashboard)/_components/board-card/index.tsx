import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";

interface BoardCardProps {
	id: string;
	title: string;
	authorName: string;
	authorId: string;
	createdAt: number;
	imageUrl: string;
	organizationId: string;
	isFavourite: boolean;
}

export const BoardCard = ({
	id,
	title,
	authorId,
	imageUrl,
	createdAt,
	authorName,
	isFavourite,
	organizationId,
}: BoardCardProps) => {
	const { userId } = useAuth();

	const authorLabel = userId === authorId ? "You" : authorName;
	const createdAtlabel = formatDistanceToNow(createdAt, {
		addSuffix: true,
	});

	// const { mutate: onFavorite, pending: pendingFavorite } = useApiMutation(
	// 	api.board.favorite
	// );
	// const { mutate: onUnFavorite, pending: pendingUnFavorite } = useApiMutation(
	// 	api.board.unfavorite
	// );

	// const toggleFavorite = () => {
	// 	if (isFavorite) {
	// 		onUnFavorite({ id }).catch(() => toast.error("Failed to unfavorite"));
	// 	} else {
	// 		onFavorite({ id, orgId }).catch(() => toast.error("Failed to favorite"));
	// 	}
	// };

	return (
		<Link href={`/board/${id}`}>
			<div className="group aspect-[100/127] border shadow-lg hovershadow-xl hover:shadow-violet-300 rounded-lg flex flex-col justify-between overflow-hidden">
				<div className="relative flex-1 bg-amber-50">
					<Image
						src={imageUrl}
						alt={title}
						fill
						className="object-fit"
						priority={true}
					/>
					<Overlay />
					{/* <BoardActions side="right" id={id} title={title}> */}
					<Button className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity px-1 py-1 outline-none bg-transparent hover:bg-transparent">
						<Image
							src="/icons/More.svg"
							alt="More icon"
							width={28}
							height={28}
							className="text-white opacity-65 hover:opacity-100 transition-opacity bg-white rounded-lg size-auto"
						/>
					</Button>
					{/* </BoardActions> */}
				</div>
				<Footer
					isFavorite={isFavourite}
					title={title}
					authorLabel={authorLabel}
					createdAtLabel={createdAtlabel}
					onClick={() => {}}
					disabled={false}
				/>
			</div>
		</Link>
	);
};

BoardCard.Skeleton = function BoardCardSkeleton() {
	return (
		<div className="aspect-[100/127] rounded-lg overflow-hidden">
			<Skeleton className="h-full w-full" />
		</div>
	);
};