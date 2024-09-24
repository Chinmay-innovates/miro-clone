import { colorToCss } from "@/lib/utils";
import { RectangleLayer as RectangleLayerType } from "@/types/canvas";

interface RectangleLayerProps {
	id: string;
	layer: RectangleLayerType;
	onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
	selectionColor?: string;
}

export const RectangleLayer = ({
	id,
	layer,
	onLayerPointerDown,
	selectionColor,
}: RectangleLayerProps) => {
	const { x, y, width, height, fill } = layer;
	return (
		<rect
			className="drop-shadow-md"
			onPointerDown={(e) => onLayerPointerDown(e, id)}
			style={{
				transform: `translateX(${x}px) translateY(${y}px)`,
			}}
			x={0}
			y={0}
			width={width}
			height={height}
			strokeWidth={1}
			fill={fill ? colorToCss(fill) : "#000"}
			stroke={selectionColor || "transparent"}
		/>
	);
};
