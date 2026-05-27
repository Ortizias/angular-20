import { Component } from '@angular/core';
import { ProductListComponent } from './products/product-list.component';

// Día 3 — el AppComponent es ahora un shell puro.
// El estado y la lógica de productos viven en ProductListComponent.
@Component({
  selector: 'app-root',
  imports: [ProductListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'Bug Tracker Shop';
}
