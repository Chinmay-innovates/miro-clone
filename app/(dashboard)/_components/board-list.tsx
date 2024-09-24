import { useQuery } from "convex/react";
import { EmptyBoards } from "./empty-boards";
import { EmptyFavourites } from "./empty-favourites";
import { EmptySearch } from "./empty-search";
import { api } from "@/convex/_generated/api";
import { BoardCard } from "./board-card";
import { CreateBoardButton } from "./create-board-button";

interface BoardListProps {
	orgId: string;
	query: {
		search?: string;
		favourites?: string;
	};
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
	const data = useQuery(api.boards.get, { orgId, ...query });
	if (data === undefined) {
		return (
			<div>
				<h2 className="text-3xl">
					{query.favourites ? "Favourite boards" : "Team boards"}
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
					<CreateBoardButton orgId={orgId} disabled />
					{Array.from({ length: 10 }).map((_, i) => (
						<BoardCard.Skeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	if (!data.length && query.search) return <EmptySearch />;

	if (!data.length && query.favourites) return <EmptyFavourites />;

	if (!data.length) return <EmptyBoards />;

	return (
		<div>
			<h2 className="text-3xl">
				{query.favourites ? "Favourite boards" : "Team boards"}
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
				<CreateBoardButton orgId={orgId} />
				{data.map((board) => (
					<BoardCard
						id={board._id}
						key={board._id}
						title={board.title}
						isFavourite={board.isFavourite}
						authorId={board.authorId}
						imageUrl={board.imageUrl}
						organizationId={board.orgId}
						authorName={board.authorName}
						createdAt={board._creationTime}
					/>
				))}
			</div>
		</div>
	);
};
