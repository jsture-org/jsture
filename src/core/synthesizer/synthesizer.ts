import { Trace, TraceType } from '../trace/trace';
import { Generator } from '../generator/generator';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DragJsture, Jsture, JstureType } from '../jsture/jsture';
import { concatMap, filter } from 'rxjs/operators';
import { isNil } from 'lodash';

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
  public drag$ = new Observable<DragJsture>();

  private trace$ = new Observable<Trace>();
  private elementMap: { [key: string]: ComponentState } = {};

  private readonly config: Config = { tapThreshold: 100 };

  constructor(private generator: Generator, config?: Config) {
    this.config = { ...this.config, ...config };
    this.trace$ = this.generator.trace$.pipe(
      concatMap(trace => {
        const elementId = this.getElementId(trace);

        if (!this.elementMap[elementId]) {
          this.elementMap[elementId] = new ComponentState({ ...this.config });
        }

        return of(trace);
      })
    );

    this.drag$ = this.getJstureObservable(subscriber => {
      this.trace$.subscribe(trace => {
        subscriber.next(this.synthesizeDrag(trace));
      });
    });
  }

  private synthesizeDrag(trace: Trace): DragJsture | null {
    let jsture: null | DragJsture = null;
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
      jsture = { type: jstureType, elementId, event: trace.event as TouchEvent | MouseEvent };
    }

    return jsture;
  }

  private getElementId(trace: Trace): string {
    return (trace.event.target as HTMLElement).dataset.jstureId;
  }

  private getJstureObservable(cb: (subscriber: any) => void): Observable<Jsture<any>> {
    return new Observable<DragJsture>(cb).pipe(filter(jsture => !isNil(jsture)));
  }
}
