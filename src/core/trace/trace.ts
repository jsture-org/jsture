export enum TraceType {
  MOVE,
  PRESS,
  RELEASE,
}

export interface Trace {
  readonly type: TraceType;
  readonly event: Event;
}

export function makeTrace(arg: { type: TraceType; event: Event }): Trace {
  return { ...arg };
}
