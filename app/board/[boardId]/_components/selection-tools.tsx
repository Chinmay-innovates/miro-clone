"use client";

import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useMutation, useSelf } from "@/liveblocks.config";
import { Camera, Color } from "@/types/canvas";
import { memo } from "react";
import { ColorPicker } from "./color-picker";
import { useDeletelayers } from "@/hooks/use-delete-layer";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";

interface SelectionToolsProps {
	setLastUsedColor: (color: Color) => void;
	camera: Camera;
}

export const SelectionTools = memo(
	({ camera, setLastUsedColor }: SelectionToolsProps) => {
		const selection = useSelf((me) => me.presence.selection);

		const moveToFront = useMutation(
			({ storage }) => {
				const liveLayerIds = storage.get("layerIds");
				const indices: number[] = [];

				const arr = liveLayerIds.toImmutable();

				for (let i = 0; i < arr.length; i++) {
					if (selection.includes(arr[i])) indices.push(i);
				}

				for (let i = indices.length - 1; i >= 0; i--) {
					liveLayerIds.move(
						indices[i],
						arr.length - 1 - (indices.length - 1 - i)
					);
				}
			},
			[selection]
		);

		const moveToBack = useMutation(
			({ storage }) => {
				const liveLayerIds = storage.get("layerIds");
				const indices: number[] = [];

				const arr = liveLayerIds.toImmutable();

				for (let i = 0; i < arr.length; i++) {
					if (selection.includes(arr[i])) indices.push(i);
				}

				for (let i = 0; i < indices.length; i++) {
					liveLayerIds.move(indices[i], i);
				}
			},
			[selection]
		);

		const setFill = useMutation(
			({ storage }, fill: Color) => {
				const liveLayers = storage.get("layers");
				setLastUsedColor(fill);

				selection.forEach((id) => {
					liveLayers.get(id)?.set("fill", fill);
				});
			},
			[selection, setLastUsedColor]
		);

		const deleteLayer = useDeletelayers();
		const selectionBounds = useSelectionBounds();
		if (!selectionBounds) return null;

		const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
		const y = selectionBounds.y + camera.y;

		return (
			<div
				className="absolute p-3 rounded-xl bg-white shadow-md border flex select-none"
				style={{
					transform: `
					translate(
					calc(${x}px - 50%),
					calc(${y - 16}px - 100%)
					)`,
				}}
			>
				<ColorPicker onChange={setFill} />
				<div className="flex flex-col justify-center items-center">
					<Hint label="Bring to front">
						<Button onClick={moveToFront} variant="board" size="icon">
							<BringToFront />
						</Button>
					</Hint>
					<Hint label="Send to back" side="bottom">
						<Button onClick={moveToBack} variant="board" size="icon">
							<SendToBack />
						</Button>
					</Hint>
				</div>
				<div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
					<Hint label="Delete">
						<Button variant="board" size="icon" onClick={deleteLayer}>
							<Trash2 />
						</Button>
					</Hint>
				</div>
			</div>
		);
	}
);
SelectionTools.displayName = "SelectionTools";
