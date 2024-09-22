import Image from "next/image";

export const EmptyFavourites = () => {
	return (
		<div className="h-full flex flex-col items-center justify-center">
			<Image
				src="/empty-favorites.svg"
				alt="Empty favourites"
				width={150}
				height={150}
			/>
			<h2 className="text-2xl font-bold mt-6">No favorite boards!</h2>
			<p className="text-muted-foreground mt-2 text-sm">
				Try favouriting some boards
			</p>
		</div>
	);
};
