"use client";

import { memo } from "react";

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";

import { RectangleLayer } from "./rectangle-layer";
import { EllipseLayer } from "./ellipse-layer";
import { TextLayer } from "./text-layer";
import { NoteLayer } from "./note-layer";

interface LayerPreviewProps {
	id: string;
	onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
	selectionColor?: string;
}

export const LayerPreview = memo(
	({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
		const layer = useStorage((root) => root.layers.get(id));
		if (!layer) return null;
		switch (layer.type) {
			case LayerType.NOTE:
				return (
					<NoteLayer
						id={id}
						layer={layer}
						onLayerPointerDown={onLayerPointerDown}
						selectionColor={selectionColor}
					/>
				);
			case LayerType.TEXT:
				return (
					<TextLayer
						id={id}
						layer={layer}
						onLayerPointerDown={onLayerPointerDown}
						selectionColor={selectionColor}
					/>
				);
			case LayerType.ELLIPSE:
				return (
					<EllipseLayer
						id={id}
						layer={layer}
						onLayerPointerDown={onLayerPointerDown}
						selectionColor={selectionColor}
					/>
				);
			case LayerType.RECTANGLE:
				return (
					<RectangleLayer
						id={id}
						layer={layer}
						onLayerPointerDown={onLayerPointerDown}
						selectionColor={selectionColor}
					/>
				);
			default:
				console.warn("Unknown layer type");
				return null;
		}
	}
);

LayerPreview.displayName = "LayerPreview";
