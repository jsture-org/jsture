export enum JstureType {
  DRAG_START = 'DRAG_START',
  DRAG_MOVE = 'DRAG_MOVE',
  DRAG_END = 'DRAG_END',
}

export interface Jsture<T> {
  readonly type: JstureType;
  readonly elementId: string;
  readonly event: T;
}

// TODO: PointerEvent 다루기
export type DragJsture = Jsture<DragEvent>;

type DragEvent = MouseEvent | TouchEvent;
