import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

interface HintProps {
	label: string;
	children: React.ReactNode;
	side?: "top" | "bottom" | "left" | "right";
	align?: "start" | "center" | "end";
	alignOffset?: number;
	sideOffset?: number;
}

export const Hint = ({
	children,
	label,
	align,
	alignOffset,
	side,
	sideOffset,
}: HintProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent
					className="text-white bg-[#1F1F1F]"
					side={side}
					align={align}
					sideOffset={sideOffset}
					alignOffset={alignOffset}
				>
					<p className="font-semibold capitalize ">{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
