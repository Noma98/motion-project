import { BaseComponent } from './../../component.js';

export class ImageComponent extends BaseComponent<HTMLElement> {
  constructor(title: string, url: string) {
    super(`<section class="image">
            <div class="image__holder"><img class="image__thumbnail"></div>
            <h2 class="page-item__title image__title"></h2>
           </section>`);

    const imageElement = this.element.querySelector(
      '.image__thumbnail'
    )! as HTMLImageElement;
    imageElement.src = url; //🌟사용자로부터 받는 데이터는 이렇게 따로 업데이트 해주는 것이 좋음(innerHTML에 포함시키지 말고)
    imageElement.alt = title;

    const titleElement = this.element.querySelector(
      '.image__title'
    )! as HTMLHeadingElement;
    titleElement.textContent = title;
  }
}
