"use client";
import { nanoid } from "nanoid";
import {
	useHistory,
	useCanRedo,
	useCanUndo,
	useMutation,
	useStorage,
} from "@/liveblocks.config";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import { useCallback, useState } from "react";
import {
	CanvasState,
	CanvasMode,
	Camera,
	Color,
	LayerType,
	Point,
} from "@/types/canvas";
import { CursorPresence } from "./cursor-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";

const MAX_LAYERS = 100;

interface CanvasProps {
	boardId: string;
}
export const Canvas = ({ boardId }: CanvasProps) => {
	const layerIds = useStorage((root) => root.layerIds);

	const [canvasState, setCanvasState] = useState<CanvasState>({
		mode: CanvasMode.NONE,
	});
	const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
	const [lastUsedColor, setLastUsedColor] = useState<Color>({
		r: 0,
		g: 0,
		b: 0,
	});

	const history = useHistory();
	const canUndo = useCanUndo();
	const canRedo = useCanRedo();

	const insertLayer = useMutation(
		(
			{ storage, setMyPresence },
			layerType:
				| LayerType.ELLIPSE
				| LayerType.RECTANGLE
				| LayerType.TEXT
				| LayerType.NOTE,
			position: Point
		) => {
			const liveLayers = storage.get("layers");
			if (liveLayers.size > MAX_LAYERS) return;

			const livelayerIds = storage.get("layerIds");
			const layerId = nanoid();

			const layer = new LiveObject({
				type: layerType,
				x: position.x,
				y: position.y,
				height: 100,
				width: 100,
				fill: lastUsedColor,
			});

			livelayerIds.push(layerId);
			liveLayers.set(layerId, layer);
			setMyPresence({ selection: [layerId] }, { addToHistory: true });
			setCanvasState({ mode: CanvasMode.NONE });
		},
		[lastUsedColor]
	);

	const onWheel = useCallback((e: React.WheelEvent) => {
		// Update the camera position by adding the delta values.
		// This will cause the canvas to be scrolled.

		setCamera((camera) => ({
			x: camera.x + e.deltaX,
			y: camera.y + e.deltaY,
		}));
	}, []);

	const onPointerMove = useMutation(
		({ setMyPresence }, e: React.PointerEvent) => {
			e.preventDefault();
			const current = pointerEventToCanvasPoint(e, camera);
			setMyPresence({ cursor: current });
		},
		[]
	);

	const onPointerLeave = useMutation(({ setMyPresence }) => {
		setMyPresence({ cursor: null });
	}, []);
	return (
		<main className="size-full relative bg-neutral-100 touch-none">
			<Info boardId={boardId} />
			<Participants />
			<Toolbar
				canvasState={canvasState}
				setCanvasState={setCanvasState}
				canUndo={canUndo}
				canRedo={canRedo}
				undo={history.undo}
				redo={history.redo}
			/>
			<svg
				onWheel={onWheel}
				onPointerMove={onPointerMove}
				onPointerLeave={onPointerLeave}
				className="h-[100%] w-[100%]"
			>
				<g
					style={{
						transform: `translate(${camera.x}px, ${camera.y}px)`,
					}}
				>
					<CursorPresence />
				</g>
			</svg>
		</main>
	);
};
