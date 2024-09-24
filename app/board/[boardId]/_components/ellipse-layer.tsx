import { colorToCss } from "@/lib/utils";
import { EllipseLayer as EllipseLayerType } from "@/types/canvas";

interface EllipseLayerProps {
	id: string;
	layer: EllipseLayerType;
	onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
	selectionColor?: string;
}

export const EllipseLayer = ({
	id,
	layer,
	onLayerPointerDown,
	selectionColor,
}: EllipseLayerProps) => {
	return (
		<ellipse
			className="drop-shadow-md"
			onPointerDown={(e) => onLayerPointerDown(e, id)}
			style={{
				transform: `translate(
  ${layer.x}px,
  ${layer.y}px
)`,
			}}
			cx={layer.width / 2}
			cy={layer.height / 2}
			rx={layer.width / 2}
			ry={layer.height / 2}
			fill={layer.fill ? colorToCss(layer.fill) : "#000"}
			stroke={selectionColor || "transparent"}
			strokeWidth="1"
		/>
	);
};
