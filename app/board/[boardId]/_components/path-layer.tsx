import { getSvgPathFromStroke } from "@/lib/utils";
import getStroke from "perfect-freehand";

interface PathLayerProps {
	x: number;
	y: number;
	points: number[][];
	fill: string;
	onLayerPointerDown?: (e: React.PointerEvent) => void;
	stroke?: string;
}

export const PathLayer = ({
	fill,
	points,
	x,
	y,
	onLayerPointerDown,
	stroke,
}: PathLayerProps) => {
	return (
		<path
			className="drop-shadow-md"
			onPointerDown={onLayerPointerDown}
			d={getSvgPathFromStroke(
				getStroke(points, {
					size: 16,
					thinning: 0.5,
					smoothing: 0.5,
					streamline: 0.5,
				})
			)}
			style={{
				transform: `translate(${x}px, ${y}px)`,
			}}
			x={0}
			y={0}
			fill={fill}
			stroke={stroke}
			strokeWidth={1}
		/>
	);
};
