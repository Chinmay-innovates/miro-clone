"use client";
import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";

interface ColorPickerProps {
	onChange: (color: Color) => void;
}

const colors = [
	{ r: 255, g: 249, b: 177 },
	{ r: 39, g: 142, b: 237 },
	{ r: 155, g: 105, b: 245 },
	{ r: 252, g: 142, b: 42 },
	{ r: 0, g: 0, b: 0 },
	{ r: 255, g: 255, b: 255 },

	{ r: 255, g: 87, b: 34 }, // Bright Orange
	{ r: 76, g: 175, b: 80 }, // Green
	{ r: 156, g: 39, b: 176 }, // Purple
	{ r: 0, g: 188, b: 212 }, // Cyan
];
export const ColorPicker = ({ onChange }: ColorPickerProps) => {
	return (
		<div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200">
			{colors.map((color) => (
				<ColorButton key={colorToCss(color)} color={color} onClick={onChange} />
			))}
		</div>
	);
};
interface ColorButtonProps {
	onClick: (color: Color) => void;
	color: Color;
}
const ColorButton = ({ onClick, color }: ColorButtonProps) => {
	return (
		<button
			type="button"
			className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
			onClick={() => onClick(color)}
			title={colorToCss(color)}
		>
			<div
				className="h-8 w-8 rounded-md border border-neutral-300"
				style={{ background: colorToCss(color) }}
			/>
		</button>
	);
};
