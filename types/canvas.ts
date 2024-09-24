export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Camera = {
  x: number;
  y: number;
};

export enum LayerType {
  RECTANGLE,
  ELLIPSE,
  PATH,
  TEXT,
  NOTE,
}
export type RectangleLayer = {
  type: LayerType.RECTANGLE;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  value?: string;
};
export type EllipseLayer = {
  type: LayerType.ELLIPSE;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  value?: string;
};
export type PathLayer = {
  type: LayerType.PATH;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  points: number[][];
  value?: string;
};
export type TextLayer = {
  type: LayerType.TEXT;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  value?: string;
};
export type NoteLayer = {
  type: LayerType.NOTE;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  value?: string;
};

export type Point = {
  x: number;
  y: number;
};

export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Side {
  TOP = 1,
  BOTTOM = 2,
  LEFT = 4,
  RIGHT = 8,
}

export type CanvasState =
  | {
      mode: CanvasMode.INSERTING;
      layerType:
        | LayerType.ELLIPSE
        | LayerType.RECTANGLE
        | LayerType.TEXT
        | LayerType.NOTE;
    }
  | {
      mode: CanvasMode.NONE;
    }
  | {
      mode: CanvasMode.PENCIL;
    }
  | {
      mode: CanvasMode.PRESSING;
      origin: Point;
    }
  | {
      mode: CanvasMode.RESIZING;
      initialBounds: XYWH;
      corner: Side;
    }
  | {
      mode: CanvasMode.SELECTION_NET;
      origin: Point;
      current?: Point;
    }
  | {
      mode: CanvasMode.TRANSLATING;
      current: Point;
    };

export enum CanvasMode {
  NONE,
  PRESSING,
  SELECTION_NET,
  TRANSLATING,
  INSERTING,
  RESIZING,
  PENCIL,
}

export type Layer =
  | EllipseLayer
  | RectangleLayer
  | TextLayer
  | NoteLayer
  | PathLayer
  | NoteLayer;
