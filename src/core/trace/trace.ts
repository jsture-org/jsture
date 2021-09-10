enum TraceType {
  MOVE,
  TAP,
  HOLD,
}

export interface Trace {
  getType: () => TraceType;
}

export class Move implements Trace {
  private type = TraceType.MOVE;

  getType(): TraceType {
    return this.type;
  }
}

export class Tap implements Trace {
  private type = TraceType.TAP;

  getType(): TraceType {
    return this.type;
  }
}

export class Hold implements Trace {
  private type = TraceType.HOLD;

  getType(): TraceType {
    return this.type;
  }
}
