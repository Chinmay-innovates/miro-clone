"use client";

import { LiveObject } from "@liveblocks/client";

import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";

import {
	useHistory,
	useCanRedo,
	useCanUndo,
	useMutation,
	useStorage,
	useOthersMapped,
} from "@/liveblocks.config";

import { Info } from "./info";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { SelectionBox } from "./selection-box";
import { LayerPreview } from "./layer-preview";
import { CursorPresence } from "./cursor-presence";

import {
	CanvasState,
	CanvasMode,
	Camera,
	Color,
	LayerType,
	Point,
	Side,
	XYWH,
} from "@/types/canvas";

import {
	connectionIdToColor,
	pointerEventToCanvasPoint,
	resizeBounds,
} from "@/lib/utils";

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

	const translateSelectedLayers = useMutation(
		({ storage, self }, point: Point) => {
			if (canvasState.mode !== CanvasMode.TRANSLATING) return;

			const offset = {
				x: point.x - canvasState.current.x,
				y: point.y - canvasState.current.y,
			};
			const liveLayers = storage.get("layers");

			for (const id of self.presence.selection) {
				const layer = liveLayers.get(id);
				if (layer)
					layer.update({
						x: layer.get("x") + offset.x,
						y: layer.get("y") + offset.y,
					});
			}
			setCanvasState({ mode: CanvasMode.TRANSLATING, current: point });
		},
		[canvasState]
	);

	const unselectLayers = useMutation(({ self, setMyPresence }) => {
		if (self.presence.selection.length > 0) {
			setMyPresence({ selection: [] }, { addToHistory: true });
		}
	}, []);

	const resizeSelectedLayer = useMutation(
		({ storage, self }, point: Point) => {
			if (canvasState.mode !== CanvasMode.RESIZING) return;
			const bounds = resizeBounds(
				canvasState.initialBounds,
				canvasState.corner,
				point
			);
			const liveLayers = storage.get("layers");
			const layer = liveLayers.get(self.presence.selection[0]);

			if (layer) layer.update(bounds);
		},
		[canvasState]
	);

	const onResizeHandlePointerDown = useCallback(
		(corner: Side, initialBounds: XYWH) => {
			history.pause();
			setCanvasState({
				mode: CanvasMode.RESIZING,
				initialBounds,
				corner,
			});
		},
		[history]
	);

	const onWheel = useCallback((e: React.WheelEvent) => {
		// Update the camera position by adding the delta values.
		// This will cause the canvas to be scrolled.

		setCamera((camera) => ({
			x: camera.x - e.deltaX,
			y: camera.y - e.deltaY,
		}));
	}, []);

	const onPointerDown = useCallback(
		(e: React.PointerEvent) => {
			const point = pointerEventToCanvasPoint(e, camera);
			if (canvasState.mode === CanvasMode.INSERTING) return;

			// TODO: add freehand drawing
			setCanvasState({ origin: point, mode: CanvasMode.PRESSING });
		},
		[camera, canvasState.mode, setCanvasState]
	);

	const onPointerMove = useMutation(
		({ setMyPresence }, e: React.PointerEvent) => {
			e.preventDefault();

			const current = pointerEventToCanvasPoint(e, camera);

			if (canvasState.mode === CanvasMode.TRANSLATING) {
				translateSelectedLayers(current);
			} else if (canvasState.mode === CanvasMode.RESIZING) {
				resizeSelectedLayer(current);
			}
			setMyPresence({ cursor: current });
		},
		[canvasState, resizeSelectedLayer, camera, translateSelectedLayers]
	);

	const onPointerLeave = useMutation(({ setMyPresence }) => {
		setMyPresence({ cursor: null });
	}, []);

	const onPointerUp = useMutation(
		({}, e) => {
			const point = pointerEventToCanvasPoint(e, camera);

			if (
				canvasState.mode === CanvasMode.NONE ||
				canvasState.mode === CanvasMode.PRESSING
			) {
				unselectLayers();
				setCanvasState({ mode: CanvasMode.NONE });
			} else if (canvasState.mode === CanvasMode.INSERTING) {
				insertLayer(canvasState.layerType, point);
			} else {
				setCanvasState({ mode: CanvasMode.NONE });
			}
			history.resume();
		},
		[camera, canvasState, history, insertLayer, unselectLayers]
	);
	const selections = useOthersMapped((other) => other.presence.selection);

	const onLayerPointerDown = useMutation(
		({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
			if (
				canvasState.mode === CanvasMode.PENCIL ||
				canvasState.mode === CanvasMode.INSERTING
			) {
				return;
			}
			history.pause();
			const point = pointerEventToCanvasPoint(e, camera);

			if (!self.presence.selection.includes(layerId)) {
				setMyPresence({ selection: [layerId] }, { addToHistory: true });
			}

			setCanvasState({ mode: CanvasMode.TRANSLATING, current: point });
		},
		[setCanvasState, camera, history, canvasState.mode]
	);

	const layerIdsToColorSelection = useMemo(() => {
		const layerIdsToColorSelection: Record<string, string> = {};
		for (const user of selections) {
			const [connectionId, selection] = user;

			for (const layerId of selection) {
				layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
			}
		}
		return layerIdsToColorSelection;
	}, [selections]);

	return (
		<main className="h-full w-full relative bg-neutral-100 touch-none">
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
				onPointerUp={onPointerUp}
				onPointerDown={onPointerDown}
				className="h-[100vh] w-[100%]"
			>
				<g
					style={{
						transform: `translate(${camera.x}px, ${camera.y}px)`,
					}}
				>
					{layerIds.map((layerId) => (
						<LayerPreview
							key={layerId}
							id={layerId}
							onLayerPointerDown={onLayerPointerDown}
							selectionColor={layerIdsToColorSelection[layerId]}
						/>
					))}
					<SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
					<CursorPresence />
				</g>
			</svg>
		</main>
	);
};
