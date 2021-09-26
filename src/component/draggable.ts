import { Jsture, JstureType } from '../core/jsture/jsture';
import { Synthesizer } from '../core/synthesizer/synthesizer';
import { filter } from 'rxjs/operators';

// TODO: 과연 component 타입으로 추상화 할 필요가 있을까??
// 제스처 이벤트 발생하는거 까지가 우리의 역할이고 사실 컴포넌트는 자유롭게 구현 가능한 것이 더 취지에 맞음
export class Draggable<T = HTMLElement> {
  constructor(private element: T, private synthesizer: Synthesizer, private readonly id: string) {
    this.synthesizer.jsture$
      .pipe(filter(jsture => !!jsture && this.id === jsture.elementId))
      .subscribe(jsture => this.attach(jsture));
  }

  private attach(jsture: Jsture): void {
    switch (jsture.type) {
      case JstureType.DRAG_START:
        this.onDragStart(jsture);
        break;
      case JstureType.DRAG_MOVE:
        this.onDragMove(jsture);
        break;
      case JstureType.DRAG_END:
        this.onDragEnd(jsture);
        break;
      default:
        // TODO: define error message
        throw Error('');
    }
  }

  private onDragMove(jsture: Jsture): void {
    // eslint-disable-next-line no-console
    console.log('onDragMove', jsture);
  }

  private onDragStart(jsture: Jsture): void {
    // eslint-disable-next-line no-console
    console.log('onDragStart', jsture);
  }

  private onDragEnd(jsture: Jsture): void {
    // eslint-disable-next-line no-console
    console.log('onDragEnd', jsture);
  }
}

// import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
// import { filter, map } from 'lodash';
// import { Subject } from 'rxjs';
// import { throttleTime } from 'rxjs/operators';
//
// // TODO(cattus-cur): shared 모듈로 옮기기
// const ERR_MSG = {
//   NOT_SUPPORTED_EVENT: '현재 지원하는 이벤트가 아닙니다.',
//   NOT_ALLOWED_EVENT: '잘못된 이벤트가 주입되었습니다.',
// };
//
// const FRAME_DELAY = 12;
//
// interface DragEvent {
//   getClientPair: () => Pair;
//   getDragEndEventName: () => string;
//   getOnDragEventName: () => string;
//   getPagePair: () => Pair;
// }
//
// interface Pair {
//   x: number;
//   y: number;
// }
//
// class MouseDragEvent implements DragEvent {
//   event: MouseEvent;
//
//   constructor(_event: Event) {
//     if (!_event.type.match(/mouse*/)) {
//       throw new Error(ERR_MSG.NOT_ALLOWED_EVENT);
//     }
//
//     this.event = _event as MouseEvent;
//   }
//
//   getDragEndEventName(): string {
//     return 'mouseup';
//   }
//
//   getOnDragEventName(): string {
//     return 'mousemove';
//   }
//
//   getClientPair(): Pair {
//     return { x: this.event.clientX, y: this.event.clientY };
//   }
//
//   getPagePair(): Pair {
//     return { x: this.event.pageX, y: this.event.pageY };
//   }
// }
//
// class TouchDragEvent implements DragEvent {
//   event: TouchEvent;
//
//   constructor(_event: Event) {
//     if (!_event.type.match(/touch*/)) {
//       throw new Error(ERR_MSG.NOT_ALLOWED_EVENT);
//     }
//
//     this.event = _event as TouchEvent;
//   }
//
//   getDragEndEventName(): string {
//     return 'touchend';
//   }
//
//   getOnDragEventName(): string {
//     return 'touchmove';
//   }
//
//   getClientPair(): Pair {
//     // TODO(cattus-cur): 멀티 터치
//     const touch = this.event.touches[0];
//
//     return { x: touch.clientX, y: touch.clientY };
//   }
//
//   getPagePair(): Pair {
//     // TODO(cattus-cur): 멀티 터치
//     const touch = this.event.touches[0];
//
//     return { x: touch.pageX, y: touch.pageY };
//   }
// }
//
// function getDragEvent(event: Event): DragEvent {
//   if (event.type.match(/mouse*/)) {
//     return new MouseDragEvent(event);
//   } else if (event.type.match(/touch*/)) {
//     return new TouchDragEvent(event);
//   } else {
//     throw Error(ERR_MSG.NOT_SUPPORTED_EVENT);
//   }
// }
//
// // TODO(cattus-cur): 비디오 같은 경우, 클릭되어서 재생안되도록 막아야함...
// // TODO(cattus-cur): 보드를 지정하고, 그 경계선에 닿을 경우 드래그 되지 않도록 수정 (스크롤과 드래그가 같이 일어나면 프레임 드랍현상 발견)
// @Directive({
//   selector: '[appDraggable]',
// })
// export class DraggableDirective implements OnInit {
//   private isDragging = false;
//   private curPair = { x: 0, y: 0 };
//   private lastPair = { x: 0, y: 0 };
//   private touchesCnt = 0;
//
//   private defaultValue = {
//     overflow: '',
//     transform: '',
//   };
//
//   dragStart$ = new Subject<Event>();
//   onDrag$ = new Subject<{ event: Event; pair: Pair }>();
//   dragEnd$ = new Subject<Event>();
//
//   constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}
//
//   ngOnInit(): void {
//     if (!this.el.nativeElement) {
//       return;
//     }
//
//     this.renderer.listen(document, 'mouseup', e => this.dragEnd(e));
//     this.renderer.listen(document, 'touchend', e => this.dragEnd(e));
//
//     this.dragStart$.subscribe((_event: Event) => {
//       this.isDragging = true;
//
//       // TODO(cattus-cur): 테스트용 코드. 제거하거나 다른 대체방법
//       this.defaultValue.overflow = document.body.style.overflow;
//       this.renderer.setStyle(document.body, 'overflow', 'hidden');
//
//       const dragEvent = getDragEvent(_event);
//       const { x: clientX, y: clientY } = dragEvent.getClientPair();
//       const { x: pageX, y: pageY } = dragEvent.getPagePair();
//
//       if (_event.type.match(/touch*/)) {
//         this.touchesCnt += (_event as TouchEvent).touches.length;
//       }
//
//       if (this.touchesCnt > 1) {
//         return;
//       }
//
//       {
//         // TODO(cattus-cur): 변수명 수정
//         const transform = this.el.nativeElement.style.transform;
//  const tR = /translate(3d)?\((-)?[0-9]*(\.[0-9]*)?px,\s*(-)?[0-9]*(\.[0-9]*)?px(,\s*(-)?[0-9]*(\.[0-9]*)?px)?\)/;
//         const translateRegex = new RegExp(tR);
//         const translateStr = filter(transform.match(translateRegex), str => !!str)[0];
//
//         console.log({ translateStr });
//
//         const pxRegex = new RegExp(/(-)?[0-9]*(\.[0-9]*)?px/g);
//         const [x, y] = map(translateStr.match(pxRegex), pixel => pixel.split('px')[0]);
//
//         console.log(x, y);
//
//         this.curPair = { x: Number(x), y: Number(y) };
//         this.defaultValue.transform = transform.replace(tR, '');
//
//         // TODO(cattus-cur): translate의 경우 translate3d로 바꾸고 end일 때, 다시 돌려준다.
//       }
//
//       this.move(_event, { x: pageX, y: pageY });
//
//       const unlisten = this.renderer.listen(document, dragEvent.getOnDragEventName(), (e: Event) => {
//         this.onDrag$.next({ event: e, pair: { x: clientX, y: clientY } });
//       });
//
//       const unlistenEvent = dragEvent.getDragEndEventName();
//
//       this.renderer.listen(this.el.nativeElement, unlistenEvent, () => {
//         this.isDragging = false;
//
//         unlisten();
//       });
//     });
//
//     this.onDrag$.pipe(throttleTime(FRAME_DELAY)).subscribe(({ event, pair }) => {
//       if (!this.el.nativeElement || !this.isDragging || this.touchesCnt > 1) {
//         return;
//       }
//
//       const { x: clientX, y: clientY } = pair;
//
//       this.move(event, { x: clientX, y: clientY });
//     });
//
//     this.dragEnd$.subscribe(() => {
//       this.isDragging = false;
//       this.curPair = this.lastPair;
//
//       // TODO(cattus-cur): 기존에 가지고있던 스타일들 적용해야함. 특히 translate
//
//       // TODO(cattus-cur): 테스트용 코드. 제거하거나 다른 방식으로 우회
//       this.renderer.setStyle(document.body, 'overflow', this.defaultValue.overflow);
//
//       // TODO(cattus-cur):z 좌표 제거해야하는데...
//       // this.defaultValue.transform = this.defaultValue.transform.replace('translated3d', 'translate');
//
//       const transform = this.el.nativeElement.style.transform;
//  const tR = /translate(3d)?\((-)?[0-9]*(\.[0-9]*)?px,\s*(-)?[0-9]*(\.[0-9]*)?px(,\s*(-)?[0-9]*(\.[0-9]*)?px)?\)/;
//       const translateRegex = new RegExp(tR);
//       const translateStr = filter(transform.match(translateRegex), str => !!str)[0];
//
//       console.log({ translateStr });
//
//       const pxRegex = new RegExp(/(-)?[0-9]*(\.[0-9]*)?px/g);
//       const [x, y] = map(translateStr.match(pxRegex), pixel => {
//         const result = pixel.split('px')[0];
//
//         console.log({ pixel });
//         console.log({ result });
//
//         return pixel.split('px')[0];
//       });
//
//       console.log(`${x}, ${y}`);
//
//       this.curPair = { x: Number(x), y: Number(y) };
//
//       this.renderer.setStyle(
//         this.el.nativeElement,
//         'transform',
//         `${transform.replace(tR, '')} translate(${this.curPair.x}px, ${this.curPair.y}px)`
//       );
//     });
//   }
//
//   @HostListener('touchstart', ['$event'])
//   @HostListener('mousedown', ['$event'])
//   onMouseDown(event: Event): void {
//     if (this.touchesCnt > 1) {
//       return;
//     }
//
//     this.dragStart$.next(event);
//   }
//
//   @HostListener('touchend', ['$event'])
//   @HostListener('mouseup', ['$event'])
//   dragEnd(event: Event): void {
//     this.dragEnd$.next();
//
//     this.touchesCnt = 0;
//   }
//
//   private move(event: Event, { x: shiftX, y: shiftY }: Pair): void {
//     const target = this.el.nativeElement;
//     const dragEvent = getDragEvent(event);
//     const { x: pageX, y: pageY } = dragEvent.getPagePair();
//     const { x: curX, y: curY } = this.curPair;
//
//     const result: Pair = { x: curX + pageX - shiftX, y: curY + pageY - shiftY };
//
//     console.log({ result });
//     console.log(this.defaultValue.transform);
//
//     // TODO(cattus-cur): translate3d 나 translate 추출하는 정규식 통해서 추출한 값을 아래의 값으로 덮어씌우는 방식이 좋을 듯
//     // TODO(cattus-cur): 아니면...
//     this.renderer.setStyle(
//       target,
//       'transform',
//       `${this.defaultValue.transform} translate3d(${result.x}px, ${result.y}px, 0px)`
//     );
//
//     this.lastPair = result;
//   }
// }
