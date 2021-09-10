// 리스너가 듣기로하면 그 엘리먼트에서 발생하는 이벤트들을 듣는다.
import { Draggable } from '../../component/draggable';

export class Initializer {
  init(): void {
    const draggable = document.querySelector(`[data-jsture="draggable"]`);

    if (!draggable) {
      return;
    }

    const draggableComp = new Draggable();
    draggableComp.attach(draggable);
  }
}
