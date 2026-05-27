import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from './models/product.model';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'Bug Tracker Shop';

  searchTerm = '';
  showOnlyAvailable = false;

  products: Product[] = [
    { id: 1, name: 'Laptop Pro 15',         price: 1299.99, stock: 10, category: 'Computadores' },
    { id: 2, name: 'Mouse Inalámbrico',     price: 29.99,  stock: 0,  category: 'Periféricos'  },
    { id: 3, name: 'Monitor 4K',            price: 299.99, stock: 5,  category: 'Periféricos'  },
    { id: 4, name: 'Teclado Mecánico',      price: 89.99,  stock: 3,  category: 'Periféricos'  },
    { id: 5, name: 'Auriculares Bluetooth', price: 59.99,  stock: 7,  category: 'Audio'        },
  ];

  // fix(bug-1): toLowerCase() en ambos lados hace la búsqueda case-insensitive
  // fix(bug-3): stock > 0 muestra solo productos con stock disponible
  get filteredProducts(): Product[] {
    let result = this.products;

    if (this.searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.showOnlyAvailable) {
      result = result.filter(p => p.stock > 0);
    }

    return result;
  }

  toggleAvailability(): void {
    this.showOnlyAvailable = !this.showOnlyAvailable;
  }
}
