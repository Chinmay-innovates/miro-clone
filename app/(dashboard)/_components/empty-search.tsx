import Image from "next/image";

export const EmptySearch = () => {
	return (
		<div className="h-full flex flex-col items-center justify-center">
			<Image
				src="/empty-search.svg"
				alt="Empty search"
				width={150}
				height={150}
			/>
			<h2 className="text-2xl font-bold mt-6">No results found!</h2>
			<p className="text-muted-foreground mt-2 text-sm">
				Try searching something else
			</p>
		</div>
	);
};
