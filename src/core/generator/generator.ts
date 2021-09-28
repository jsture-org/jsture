import { makeTrace, Trace, TraceType } from '../trace/trace';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export class Generator {
  public trace$: Observable<Trace>;

  constructor(private world: HTMLElement) {
    this.trace$ = new Observable<Trace>(subscriber => {
      merge(fromEvent(world, 'mousemove'), fromEvent(world, 'pointermove'), fromEvent(world, 'touchmove'))
        .pipe(filter(e => this.hasJstrueId(e)))
        .subscribe(e => {
          subscriber.next(makeTrace({ type: TraceType.MOVE, event: e }));
        });

      merge(fromEvent(world, 'mousedown'), fromEvent(world, 'touchstart'))
        .pipe(filter(e => this.hasJstrueId(e)))
        .subscribe(e => {
          subscriber.next(makeTrace({ type: TraceType.PRESS, event: e }));
        });

      merge(fromEvent(world, 'mouseup'), fromEvent(world, 'touchend'))
        .pipe(filter(e => this.hasJstrueId(e)))
        .subscribe(e => {
          subscriber.next(makeTrace({ type: TraceType.RELEASE, event: e }));
        });

      // TODO: touchcancel 이벤트 고려
    });
  }

  private hasJstrueId(event: Event): boolean {
    return !!(event.target as HTMLElement).dataset.jstureId;
  }
}
