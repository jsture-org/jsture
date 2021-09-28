// 리스너가 듣기로하면 그 엘리먼트에서 발생하는 이벤트들을 듣는다.
import { Draggable } from '../../component/draggable';
import { Synthesizer } from '../synthesizer/synthesizer';
import { Generator } from '../generator/generator';

export class Initializer {
  // TODO: DEBUG 모드 추가.
  // 스택에 이벤트들 담아서 로그 볼 수 있도록 수정

  private id = 1;

  // TODO: config 추가
  init(): void {
    const draggables = document.querySelectorAll(`[data-jsture="draggable"]`);

    if (!draggables?.length) {
      return;
    }

    // TODO: 월드 컨셉 잡기

    // TODO: config 추가
    const generator = new Generator(document.documentElement);
    const synthesizer = new Synthesizer(generator);

    draggables.forEach(draggable => {
      draggable.setAttribute('data-jsture-id', `${this.id}`);

      new Draggable<HTMLDivElement>(draggable as HTMLDivElement, synthesizer, String(this.id));

      this.id += 1;
    });

    // TODO: Element to HTMLElement
    // Draggable.attach(draggable)
  }
}
