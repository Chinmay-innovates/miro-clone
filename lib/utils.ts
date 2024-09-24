import { Camera, Color, Point, Side, XYWH } from "@/types/canvas";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const COLORS = [
  "#DC2626",
  "#D97706",
  "#7C3AED",
  "#DB2777",
  "#FF5AFF",
  "#2D9CDB",
  "#27AE60",
  "#EB5757",
  "#56CCF2",
  "#6FCF97",
  "#BB6BD9",
];
function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

function pointerEventToCanvasPoint(e: React.PointerEvent, camera: Camera) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g
    .toString(16)
    .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}
function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const x =
    (corner & Side.LEFT) === Side.LEFT
      ? Math.min(point.x, bounds.x + bounds.width)
      : (corner & Side.RIGHT) === Side.RIGHT
        ? Math.min(point.x, bounds.x)
        : bounds.x;

  const y =
    (corner & Side.TOP) === Side.TOP
      ? Math.min(point.y, bounds.y + bounds.height)
      : (corner & Side.BOTTOM) === Side.BOTTOM
        ? Math.min(point.y, bounds.y)
        : bounds.y;

  const width =
    (corner & Side.LEFT) === Side.LEFT
      ? Math.abs(bounds.x + bounds.width - point.x)
      : (corner & Side.RIGHT) === Side.RIGHT
        ? Math.abs(point.x - bounds.x)
        : bounds.width;

  const height =
    (corner & Side.TOP) === Side.TOP
      ? Math.abs(bounds.y + bounds.height - point.y)
      : (corner & Side.BOTTOM) === Side.BOTTOM
        ? Math.abs(point.y - bounds.y)
        : bounds.height;

  return { x, y, width, height };
}

export {
  cn,
  colorToCss,
  resizeBounds,
  connectionIdToColor,
  pointerEventToCanvasPoint,
};
