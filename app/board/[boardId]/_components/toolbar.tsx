import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

import { Skeleton } from "@/components/ui/skeleton";
import { ToolButton } from "./tool-button";
import {
	Circle,
	MousePointer2,
	Pencil,
	Redo2,
	Square,
	StickyNote,
	Type,
	Undo2,
} from "lucide-react";

interface ToolbarProps {
	canvasState: CanvasState;
	setCanvasState: (canvasState: CanvasState) => void;
	undo: () => void;
	redo: () => void;
	canUndo: boolean;
	canRedo: boolean;
}

export const Toolbar = ({
	canRedo,
	canUndo,
	canvasState,
	setCanvasState,
	undo,
	redo,
}: ToolbarProps) => {
	return (
		<div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
			<div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
				<ToolButton
					label="Select"
					icon={MousePointer2}
					onClick={() => setCanvasState({ mode: CanvasMode.NONE })}
					isActive={
						canvasState.mode === CanvasMode.NONE ||
						canvasState.mode === CanvasMode.TRANSLATING ||
						canvasState.mode === CanvasMode.SELECTION_NET ||
						canvasState.mode === CanvasMode.PRESSING ||
						canvasState.mode === CanvasMode.RESIZING
					}
				/>
				<ToolButton
					label="Text"
					icon={Type}
					onClick={() =>
						setCanvasState({
							mode: CanvasMode.INSERTING,
							layerType: LayerType.TEXT,
						})
					}
					isActive={
						canvasState.mode === CanvasMode.INSERTING &&
						canvasState.layerType === LayerType.TEXT
					}
				/>
				<ToolButton
					label="Sticky note"
					icon={StickyNote}
					onClick={() =>
						setCanvasState({
							mode: CanvasMode.INSERTING,
							layerType: LayerType.NOTE,
						})
					}
					isActive={
						canvasState.mode === CanvasMode.INSERTING &&
						canvasState.layerType === LayerType.NOTE
					}
				/>
				<ToolButton
					label="Rectangle"
					icon={Square}
					onClick={() =>
						setCanvasState({
							mode: CanvasMode.INSERTING,
							layerType: LayerType.RECTANGLE,
						})
					}
					isActive={
						canvasState.mode === CanvasMode.INSERTING &&
						canvasState.layerType === LayerType.RECTANGLE
					}
				/>
				<ToolButton
					label="Ellipse"
					icon={Circle}
					onClick={() =>
						setCanvasState({
							mode: CanvasMode.INSERTING,
							layerType: LayerType.ELLIPSE,
						})
					}
					isActive={
						canvasState.mode === CanvasMode.INSERTING &&
						canvasState.layerType === LayerType.ELLIPSE
					}
				/>
				<ToolButton
					label="Pen"
					icon={Pencil}
					onClick={() =>
						setCanvasState({
							mode: CanvasMode.PENCIL,
						})
					}
					isActive={canvasState.mode === CanvasMode.PENCIL}
				/>
			</div>
			<div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
				<ToolButton
					label="Undo"
					icon={Undo2}
					onClick={undo}
					isDisabled={!canUndo}
				/>
				<ToolButton
					label="Redo"
					icon={Redo2}
					onClick={redo}
					isDisabled={!canRedo}
				/>
			</div>
		</div>
	);
};

export const ToolbarSkeleton = () => {
	return (
		<div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[56px] shadow-md rounded-md p-2">
			<Skeleton className="h-full w-full bg-slate-300" />
		</div>
	);
};
