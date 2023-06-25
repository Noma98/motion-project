import { Hoverable, Droppable } from './../common/type.js';
import {
  EnableDragging,
  EnableDrop,
  EnableHover,
} from '../../decorators/draggable.js';
import { Draggable } from '../common/type.js';
import { BaseComponent, Component } from '../component.js';

export interface Composable {
  addChild(child: Component): void;
}
type OnCloseListener = () => void;
type DragState = 'start' | 'stop' | 'enter' | 'leave';
type OnDragStateListener<T extends Component> = (
  //바로 PageItemComponent를 주면 이 리스너는 PageItemComponent에서 밖에 못쓰고, Component를 주면 PageItemComponent의 서브타입을 전달하는 순간 타입 정보가 사라지기 때문에 제네릭을 사용함.
  target: T,
  state: DragState
) => void;

export interface SectionContainer
  extends Component,
    Composable,
    Draggable,
    Hoverable {
  setOnCloseListener(listener: OnCloseListener): void;
  setOnDragStateListener(listener: OnDragStateListener<SectionContainer>): void;
  muteChildren(state: 'mute' | 'unmute'): void;
  getBoundingRect(): DOMRect;
  onDropped(): void;
}

type SectionContainerConstructor = {
  new (): SectionContainer;
};

@EnableDragging
@EnableHover
export class PageItemComponent
  extends BaseComponent<HTMLElement>
  implements SectionContainer
{
  private closeListener?: OnCloseListener;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;
  constructor() {
    super(`<li class="page-item" draggable="true"> 
            <section class="page-item__body"></section>
            <div class="page-item__controls">
              <button class="close">&times;</button>
            </div>
           </li>`);
    const closeBtn = this.element.querySelector('.close')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    };
  }
  onDragStart(_: DragEvent) {
    //사용하지 않는 거는 _ 처리하면 warning이 사라짐 -> 나중에 정말 필요 없어지면 아예 받지 않는 식으로 수정
    this.notifyDragObservers('start');
    this.element.classList.add('lifted');
  }
  onDragEnd(_: DragEvent) {
    this.notifyDragObservers('stop');
    this.element.classList.remove('lifted');
  }
  onDragEnter(_: DragEvent) {
    this.notifyDragObservers('enter');
    this.element.classList.add('drop-area');
  }
  onDragLeave(_: DragEvent) {
    this.notifyDragObservers('leave');
    this.element.classList.remove('drop-area'); //drop되면 leave가 발생되지 않아 drop에도 로직을 추가해줘야함
  }
  onDropped(): void {
    this.element.classList.remove('drop-area');
  }
  notifyDragObservers(state: DragState) {
    this.dragStateListener && this.dragStateListener(this, state);
  }
  addChild(child: Component) {
    const container = this.element.querySelector(
      '.page-item__body'
    )! as HTMLElement;
    child.attachTo(container);
  }
  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
  setOnDragStateListener(listener: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listener;
  }
  muteChildren(state: 'mute' | 'unmute') {
    if (state === 'mute') {
      this.element.classList.add('mute-children');
    } else {
      this.element.classList.remove('mute-children');
    }
  }
  getBoundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}
@EnableDrop
export class PageComponent
  extends BaseComponent<HTMLUListElement>
  implements Composable, Droppable
{
  private children = new Set<SectionContainer>();
  private dropTarget?: SectionContainer | undefined;
  private dragTarget?: SectionContainer | undefined;

  constructor(private pageItemConstructor: SectionContainerConstructor) {
    super(`<ul class="page"></ul>`);
  }
  onDragOver(_: DragEvent): void {}
  //Page라는 컴포넌트 안에서 어떤 요소들이 드래깅 되고 있고, 어디로 드래그 오버되는지 알고 있음. 그래서 드랍되는 순간 포지션을 계산해서 그 위치에 추가해 줄 것
  onDrop(event: DragEvent) {
    //위치 바꾸기
    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dragTarget !== this.dropTarget) {
      const dropY = event.clientY;
      const dragY = this.dragTarget.getBoundingRect().y;
      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(
        this.dragTarget,
        dropY < dragY ? 'beforebegin' : 'afterend'
      );
    }
    this.dropTarget.onDropped();
  }
  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      item.removeFrom(this.element);
      this.children.delete(item);
    });
    this.children.add(item);
    item.setOnDragStateListener(
      (target: SectionContainer, state: DragState) => {
        switch (state) {
          case 'start':
            this.dragTarget = target;
            this.updateSections('mute');
            break;
          case 'stop':
            this.dragTarget = undefined;
            this.updateSections('unmute');
            break;
          case 'enter':
            this.dropTarget = target;
            break;
          case 'leave':
            this.dropTarget = undefined;
            break;
          default:
            throw new Error(`unsupported sate: ${state}`);
        }
      }
    );
  }
  private updateSections(state: 'mute' | 'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state);
    });
  }
}
