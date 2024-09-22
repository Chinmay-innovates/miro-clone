import Image from "next/image";

export const Loading = () => {
	return (
		<div className="size-full flex flex-col justify-center items-center">
			<Image
				unoptimized
				alt="Loader"
				src="/loader2.gif"
				width={300}
				height={300}
			/>
		</div>
	);
};
