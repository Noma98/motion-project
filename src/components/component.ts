//Encapsulate the HTML element creation

//api가 있다면 해당 클래스를 여기저기 전달하고 의사소통하기 보다는 interface를 쓰는 것이 좋음
export interface Component {
  //자기 자신을 제공된 부모 컨테이너에 추가하거나 제거
  attachTo(parent: HTMLElement, position?: InsertPosition): void;
  removeFrom(parent: HTMLElement): void;
  //전달 받은 컴포넌트를 나 자신 안에다가 붙여주기
  attach(component: Component, position?: InsertPosition): void;
}

export class BaseComponent<T extends HTMLElement> implements Component {
  /**
   * element
   *  사용하는 사람이 다양한 HTMLElement의 서브 클래스를 이용할 수 있도록 제네릭 사용
   *  외부에선 볼 수 없고 해당 클래스를 상속하는 자식 클래스에서만 접근이 가능하도록 protected
   *  한 번 만들어진 요소는 읽기만 가능함 -> readonly
   *  요소를 만들면 요소 안의 상태들은 변경이 가능하지만 요소 자체를 다른 것으로 변경하는 것은 불가
   */
  protected readonly element: T;

  constructor(htmlString: string) {
    const template = document.createElement('template');
    template.innerHTML = htmlString;
    this.element = template.content.firstElementChild! as T;
  }
  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element);
  }
  removeFrom(parent: HTMLElement) {
    if (parent !== this.element.parentElement) {
      throw new Error('Parent mismatch!');
    }
    parent.removeChild(this.element);
  }
  attach(component: Component, position?: InsertPosition) {
    component.attachTo(this.element, position);
  }
}
