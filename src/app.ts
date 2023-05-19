import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
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

    const note = new NoteComponent('Note Title', 'Note Body');
    note.attachTo(appRoot, 'beforeend');

    const todo = new TodoComponent('Todo Title', 'Todo');
    todo.attachTo(appRoot, 'beforeend');

    const video = new VideoComponent(
      'Video Title',
      'https://youtu.be/AedcYlARH8g'
    );
    video.attachTo(appRoot, 'beforeend');
  }
}
new App(document.querySelector('.document') as HTMLElement);
