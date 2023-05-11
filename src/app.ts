import { ImageComponent } from './components/page/item/image.js';
import { PageComponent } from './components/page/page.js';

class App {
  private readonly page: PageComponent;

  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attachTo(appRoot);
    const image = new ImageComponent(
      'My Image',
      'https://picsum.photos/500/300'
    );
    image.attachTo(appRoot, 'beforeend');
  }
}
new App(document.querySelector('.document') as HTMLElement);
