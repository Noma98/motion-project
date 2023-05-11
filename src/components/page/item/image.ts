export class ImageComponent {
  private element: HTMLElement;

  constructor(title: string, url: string) {
    const template = document.createElement('template');

    //🌟사용자로부터 받은 데이터를 html에 넣고 싶을 때 innerHTML을 사용하면 위험함. 입력값이 없을 땐 상관X
    template.innerHTML = `<section class="image">
    <div class="image__holder"><img class="image__thumbnail"></div>
    <p class="image__title"></p>
  </section>`;
    this.element = template.content.firstElementChild! as HTMLElement;
    //firstElementChild: read-only property returns an element's first child Element, or null if there are no child elements.

    const imageElement = this.element.querySelector(
      '.image__thumbnail'
    )! as HTMLImageElement;
    imageElement.src = url; //🌟사용자로부터 받는 데이터는 이렇게 따로 업데이트 해주는 것이 좋음(innerHTML에 포함시키지 말고)
    imageElement.alt = title;

    const titleElement = this.element.querySelector(
      '.image__title'
    )! as HTMLParagraphElement;
    titleElement.textContent = title;
  }
  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element);
  }
}
