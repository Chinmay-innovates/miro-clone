"use client";

import { nanoid } from "nanoid";
import { useCallback, useMemo, useState, useEffect } from "react";
import { LiveObject } from "@liveblocks/client";

import {
	useHistory,
	useCanUndo,
	useCanRedo,
	useMutation,
	useStorage,
	useOthersMapped,
	useSelf,
} from "@/liveblocks.config";
import {
	colorToCss,
	connectionIdToColor,
	findIntersectingLayersWithRectangle,
	penPointsToPathLayer,
	pointerEventToCanvasPoint,
	resizeBounds,
} from "@/lib/utils";
import {
	Camera,
	CanvasMode,
	CanvasState,
	Color,
	LayerType,
	Point,
	Side,
	XYWH,
} from "@/types/canvas";

import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeletelayers } from "@/hooks/use-delete-layer";

import { Info } from "./info";
import { Status } from "./status";
import { Toolbar } from "./toolbar";
import { PathLayer } from "./path-layer";
import { Participants } from "./participants";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { CursorPresence } from "./cursor-presence";
import { SelectionTools } from "./selection-tools";

const SELECTION_NET_THRESHOLD = 5;
const MAX_LAYERS = 100;

interface CanvasProps {
	boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
	const layerIds = useStorage((root) => root.layerIds);

	const pencilDraft = useSelf((me) => me.presence.pencilDraft);
	const [canvasState, setCanvasState] = useState<CanvasState>({
		mode: CanvasMode.NONE,
	});
	const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
	const [lastUsedColor, setLastUsedColor] = useState<Color>({
		r: 0,
		g: 0,
		b: 0,
	});

	useDisableScrollBounce();
	const history = useHistory();
	const canUndo = useCanUndo();
	const canRedo = useCanRedo();

	/* >>>>>>>>>>> LAYERS >>>>>>>>>>> */
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
			if (liveLayers.size >= MAX_LAYERS) {
				return;
			}

			const liveLayerIds = storage.get("layerIds");
			const layerId = nanoid();
			const layer = new LiveObject({
				type: layerType,
				x: position.x,
				y: position.y,
				height: 100,
				width: 100,
				fill: lastUsedColor,
			});

			liveLayerIds.push(layerId);
			liveLayers.set(layerId, layer);

			setMyPresence({ selection: [layerId] }, { addToHistory: true });
			setCanvasState({ mode: CanvasMode.NONE });
		},
		[lastUsedColor]
	);

	const translateSelectedLayers = useMutation(
		({ storage, self }, point: Point) => {
			if (canvasState.mode !== CanvasMode.TRANSLATING) {
				return;
			}

			const offset = {
				x: point.x - canvasState.current.x,
				y: point.y - canvasState.current.y,
			};

			const liveLayers = storage.get("layers");

			for (const id of self.presence.selection) {
				const layer = liveLayers.get(id);

				if (layer) {
					layer.update({
						x: layer.get("x") + offset.x,
						y: layer.get("y") + offset.y,
					});
				}
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

	const updateSelectionNet = useMutation(
		({ storage, setMyPresence }, current: Point, origin: Point) => {
			const layers = storage.get("layers").toImmutable();
			setCanvasState({
				mode: CanvasMode.SELECTION_NET,
				origin,
				current,
			});

			const ids = findIntersectingLayersWithRectangle(
				layerIds,
				layers,
				origin,
				current
			);

			setMyPresence({ selection: ids });
		},
		[layerIds]
	);

	const startMultiSelection = useCallback((current: Point, origin: Point) => {
		if (
			Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) >
			SELECTION_NET_THRESHOLD
		) {
			setCanvasState({
				mode: CanvasMode.SELECTION_NET,
				origin,
				current,
			});
		}
	}, []);

	const resizeSelectedLayer = useMutation(
		({ storage, self }, point: Point) => {
			if (canvasState.mode !== CanvasMode.RESIZING) {
				return;
			}

			const bounds = resizeBounds(
				canvasState.initialBounds,
				canvasState.corner,
				point
			);

			const liveLayers = storage.get("layers");
			const layer = liveLayers.get(self.presence.selection[0]);

			if (layer) {
				layer.update(bounds);
			}
		},
		[canvasState]
	);

	/* >>>>>>>>>>> DRAWING >>>>>>>>>>> */
	const continueDrawing = useMutation(
		({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
			const { pencilDraft } = self.presence;

			if (
				canvasState.mode !== CanvasMode.PENCIL ||
				e.buttons !== 1 ||
				pencilDraft == null
			) {
				return;
			}

			setMyPresence({
				cursor: point,
				pencilDraft:
					pencilDraft.length === 1 &&
					pencilDraft[0][0] === point.x &&
					pencilDraft[0][1] === point.y
						? pencilDraft
						: [...pencilDraft, [point.x, point.y, e.pressure]],
			});
		},
		[canvasState.mode]
	);

	const insertPath = useMutation(
		({ storage, self, setMyPresence }) => {
			const liveLayers = storage.get("layers");
			const { pencilDraft } = self.presence;

			if (
				pencilDraft == null ||
				pencilDraft.length < 2 ||
				liveLayers.size >= MAX_LAYERS
			) {
				setMyPresence({ pencilDraft: null });
				return;
			}

			const id = nanoid();
			liveLayers.set(
				id,
				new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
			);

			const liveLayerIds = storage.get("layerIds");
			liveLayerIds.push(id);

			setMyPresence({ pencilDraft: null });
			setCanvasState({ mode: CanvasMode.PENCIL });
		},
		[lastUsedColor]
	);

	const startDrawing = useMutation(
		({ setMyPresence }, point: Point, pressure: number) => {
			setMyPresence({
				pencilDraft: [[point.x, point.y, pressure]],
				penColor: lastUsedColor,
			});
		},
		[lastUsedColor]
	);

	const onWheel = useCallback((e: React.WheelEvent) => {
		setCamera((camera) => ({
			x: camera.x - e.deltaX,
			y: camera.y - e.deltaY,
		}));
	}, []);

	/* >>>>>>>>>>> POINTER_EVENTS >>>>>>>>>>> */
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

	const onPointerMove = useMutation(
		({ setMyPresence }, e: React.PointerEvent) => {
			e.preventDefault();

			const current = pointerEventToCanvasPoint(e, camera);

			if (canvasState.mode === CanvasMode.PRESSING) {
				startMultiSelection(current, canvasState.origin);
			} else if (canvasState.mode === CanvasMode.SELECTION_NET) {
				updateSelectionNet(current, canvasState.origin);
			} else if (canvasState.mode === CanvasMode.TRANSLATING) {
				translateSelectedLayers(current);
			} else if (canvasState.mode === CanvasMode.RESIZING) {
				resizeSelectedLayer(current);
			} else if (canvasState.mode === CanvasMode.PENCIL) {
				continueDrawing(current, e);
			}

			setMyPresence({ cursor: current });
		},
		[
			continueDrawing,
			camera,
			canvasState,
			resizeSelectedLayer,
			translateSelectedLayers,
			startMultiSelection,
			updateSelectionNet,
		]
	);

	const onPointerLeave = useMutation(({ setMyPresence }) => {
		setMyPresence({ cursor: null });
	}, []);

	const onPointerDown = useCallback(
		(e: React.PointerEvent) => {
			const point = pointerEventToCanvasPoint(e, camera);

			if (canvasState.mode === CanvasMode.INSERTING) {
				return;
			}

			if (canvasState.mode === CanvasMode.PENCIL) {
				startDrawing(point, e.pressure);
				return;
			}

			setCanvasState({ origin: point, mode: CanvasMode.PRESSING });
		},
		[camera, canvasState.mode, setCanvasState, startDrawing]
	);

	const onPointerUp = useMutation(
		({}, e) => {
			const point = pointerEventToCanvasPoint(e, camera);

			if (
				canvasState.mode === CanvasMode.NONE ||
				canvasState.mode === CanvasMode.PRESSING
			) {
				unselectLayers();
				setCanvasState({
					mode: CanvasMode.NONE,
				});
			} else if (canvasState.mode === CanvasMode.PENCIL) {
				insertPath();
			} else if (canvasState.mode === CanvasMode.INSERTING) {
				insertLayer(canvasState.layerType, point);
			} else {
				setCanvasState({
					mode: CanvasMode.NONE,
				});
			}

			history.resume();
		},
		[
			setCanvasState,
			camera,
			canvasState,
			history,
			insertLayer,
			unselectLayers,
			insertPath,
		]
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
			e.stopPropagation();

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

	const deleteLayers = useDeletelayers();

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			switch (e.key) {
				case "Delete": {
					deleteLayers();
					break;
				}
				case "z": {
					if (e.ctrlKey || e.metaKey) {
						history.undo();
						break;
					}
				}
				case "y": {
					if (e.ctrlKey || e.metaKey) {
						history.redo();
						break;
					}
				}
			}
		}

		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [deleteLayers, history]);

	return (
		<main className="h-full w-full relative bg-neutral-100 touch-none">
			<Info boardId={boardId} />
			<Participants />
			<div className="absolute right-2 bottom-3">
				<Status />
			</div>
			<Toolbar
				canvasState={canvasState}
				setCanvasState={setCanvasState}
				undo={history.undo}
				redo={history.redo}
				canUndo={canUndo}
				canRedo={canRedo}
			/>
			<SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />
			<svg
				className="h-[100vh] w-[100vw]"
				onWheel={onWheel}
				onPointerMove={onPointerMove}
				onPointerLeave={onPointerLeave}
				onPointerUp={onPointerUp}
				onPointerDown={onPointerDown}
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
					{canvasState.mode === CanvasMode.SELECTION_NET &&
						canvasState.current != null && (
							<rect
								className="fill-blue-500/5 stroke-blue-500 stroke-1"
								x={Math.min(canvasState.origin.x, canvasState.current.x)}
								y={Math.min(canvasState.origin.y, canvasState.current.y)}
								width={Math.abs(canvasState.origin.x - canvasState.current.x)}
								height={Math.abs(canvasState.origin.y - canvasState.current.y)}
							/>
						)}

					<CursorPresence />
					{pencilDraft != null && pencilDraft.length > 0 && (
						<PathLayer
							points={pencilDraft}
							fill={colorToCss(lastUsedColor)}
							x={0}
							y={0}
						/>
					)}
				</g>
			</svg>
		</main>
	);
};
