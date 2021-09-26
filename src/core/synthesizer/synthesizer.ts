import { Trace, TraceType } from '../trace/trace';
import { Generator } from '../generator/generator';
import { BehaviorSubject, Observable } from 'rxjs';
import { Jsture, JstureType } from '../jsture/jsture';
import { makeJsture } from '../jsture/drag';

interface Config {
  // cattus: tap 인지 hold 인지 구별하기 위한 경계값
  tapThreshold: number;
}

class ComponentState {
  private isPressed$ = new BehaviorSubject<boolean>(false);
  private pressedTime = 0;

  private readonly config;

  get isPressed(): boolean {
    return this.isPressed$.value;
  }

  constructor(config: Config) {
    this.config = { ...this.config, ...config };

    this.isPressed$.subscribe(isPressed => {
      if (isPressed) {
        this.pressedTime = Date.now();

        return;
      }

      const delay = Date.now() - this.pressedTime;
      const isOverDelay = delay >= this.config.tapThreshold;
      const isTap = !isOverDelay;
      const isHold = isOverDelay;

      this.pressedTime = 0;
    });
  }

  toggle(pressed: boolean): void {
    this.isPressed$.next(pressed);
  }
}

export class Synthesizer {
  public jsture$: Observable<Jsture>;

  private elementMap: { [key: string]: ComponentState } = {};

  private readonly config: Config = { tapThreshold: 100 };

  constructor(private generator: Generator, config?: Config) {
    this.config = { ...this.config, ...config };

    this.jsture$ = new Observable<Jsture>(subscriber => {
      this.generator.trace$.subscribe(trace => {
        const elementId = this.getElementId(trace);

        if (!this.elementMap[elementId]) {
          this.elementMap[elementId] = new ComponentState({ ...this.config });
        }

        const jsture = this.synthesize(trace);

        if (jsture) {
          subscriber.next(jsture);
        }
      });
    });
  }

  private synthesize(trace: Trace): Jsture | null {
    let jsture: null | Jsture = null;
    let jstureType: null | JstureType = null;
    const traceType = trace.type;
    const elementId = this.getElementId(trace);
    const state = this.elementMap[elementId];
    // TODO(cattus): 이전에 드래그 시작하지도 않았을 경우에는 어떻게 대응할 것인가.
    const isDragMove = traceType === TraceType.MOVE && state.isPressed;
    const isDragStart = traceType === TraceType.PRESS;
    const isDragEnd = traceType === TraceType.RELEASE;

    if (isDragStart) {
      jstureType = JstureType.DRAG_START;

      state.toggle(true);
    } else if (isDragMove) {
      jstureType = JstureType.DRAG_MOVE;
    } else if (isDragEnd) {
      jstureType = JstureType.DRAG_END;

      state.toggle(false);
    }

    if (jstureType) {
      jsture = makeJsture({ type: jstureType, elementId });
    }

    // if (!jsture) {
    // TODO: define error message
    // throw Error('');
    // }

    return jsture;
  }

  private getElementId(trace: Trace): string {
    return (trace.event.target as HTMLElement).dataset.jstureId;
  }
}
