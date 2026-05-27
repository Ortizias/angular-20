import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from './models/product.model';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Bug Tracker Shop';

  // fix(bug-1): tipado correcto como Product[], TypeScript detecta propiedades inválidas
  products: Product[] = [
    { id: 1, name: 'Laptop Pro 15',         price: 1299.99, stock: 10, category: 'Computadores' },
    { id: 2, name: 'Mouse Inalámbrico',     price: 29.99,  stock: 0,  category: 'Periféricos'  },
    { id: 3, name: 'Monitor 4K',            price: 299.99, stock: 5,  category: 'Periféricos'  }, // fix(bug-1): 'nane' → 'name'
    { id: 4, name: 'Teclado Mecánico',      price: 89.99,  stock: 3,  category: 'Periféricos'  },
    { id: 5, name: 'Auriculares Bluetooth', price: 59.99,  stock: 7,  category: 'Audio'        },
  ];
}
