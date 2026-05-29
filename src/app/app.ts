import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { ProductListComponent } from './products/product-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'Bug Tracker Shop';
}
