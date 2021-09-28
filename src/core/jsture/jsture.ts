export enum JstureType {
  DRAG_START = 'DRAG_START',
  DRAG_MOVE = 'DRAG_MOVE',
  DRAG_END = 'DRAG_END',
}

export interface Jsture {
  readonly type: JstureType;
  readonly elementId: string;
}
