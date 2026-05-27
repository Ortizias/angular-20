import { Component, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductCardComponent } from './product-card.component';
import { ProductFilterComponent } from './product-filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, ProductFilterComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  readonly products = signal<Product[]>([
    { id: 1, name: 'Laptop Pro 15',         price: 1299.99, stock: 10, category: 'Computadores' },
    { id: 2, name: 'Mouse Inalámbrico',     price: 29.99,  stock: 0,  category: 'Periféricos'  },
    { id: 3, name: 'Monitor 4K',            price: 299.99, stock: 5,  category: 'Periféricos'  },
    { id: 4, name: 'Teclado Mecánico',      price: 89.99,  stock: 3,  category: 'Periféricos'  },
    { id: 5, name: 'Auriculares Bluetooth', price: 59.99,  stock: 7,  category: 'Audio'        },
  ]);

  readonly searchTerm = signal('');
  readonly showOnlyAvailable = signal(false);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const onlyAvailable = this.showOnlyAvailable();
    return this.products().filter(p => {
      const matchesTerm = !term ||
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term);
      const matchesAvailability = !onlyAvailable || this.isAvailable(p);
      return matchesTerm && matchesAvailability;
    });
  });

  isAvailable(product: Product): boolean {
    return product.stock > 0;
  }

  onFilterChange(term: string): void {
    this.searchTerm.set(term);
  }

  toggleAvailable(): void {
    this.showOnlyAvailable.update(v => !v);
  }
}
