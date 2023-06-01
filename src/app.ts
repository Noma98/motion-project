import { ImageComponent } from './components/page/item/image.js';
import { NoteComponent } from './components/page/item/note.js';
import { TodoComponent } from './components/page/item/todo.js';
import { VideoComponent } from './components/page/item/video.js';
import { Composable, PageComponent } from './components/page/page.js';
import { Component } from './components/component.js';

class App {
  private readonly page: Component & Composable; //클래스 타입이 아니라 인터페이스 타입으로 지정하는 것이 좋음
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attachTo(appRoot);

    const image = new ImageComponent(
      'My Image',
      'https://picsum.photos/500/300'
    );
    this.page.addChild(image);

    const note = new NoteComponent('Note Title', 'Note Body');
    this.page.addChild(note);

    const todo = new TodoComponent('Todo Title', 'Todo');
    this.page.addChild(todo);

    const video = new VideoComponent(
      'Video Title',
      'https://youtu.be/AedcYlARH8g'
    );
    this.page.addChild(video);
  }
}
new App(document.querySelector('.document') as HTMLElement);
