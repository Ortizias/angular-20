import { Component, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductCardComponent } from './product-card.component';
import { ProductFilterComponent } from './product-filter.component';

// ─────────────────────────────────────────────────────────────
// COMPONENTE CONTENEDOR (Smart Component)
//
// Responsabilidades:
//   ✅ Poseer el estado (lista de productos, término de búsqueda)
//   ✅ Filtrar la lista cuando cambia el término
//   ✅ Pasar datos hacia los hijos via @Input
//   ✅ Escuchar eventos de los hijos via @Output
//
// NO debe:
//   ❌ Encargarse de cómo se ve una tarjeta individual
//   ❌ Saber qué HTML genera el filtro
//
// ─── Flujo de datos ────────────────────────────────────────
//
//   ProductListComponent (estado)
//     │
//     ├──[product]──▶ ProductCardComponent  (visual)
//     │
//     └──(filterChange)◀── ProductFilterComponent  (visual)
//
// ─────────────────────────────────────────────────────────────

// BUG-1 (introducido): se pasaba products[10] (índice fuera de rango)
//   al <app-product-card>, por lo que el hijo recibía undefined.
//
//   ❌  <app-product-card [product]="products[10]" />
//
// fix(bug-1): se itera la lista filtrada correctamente con @for,
//   garantizando que cada [product] apunta a un objeto real.
//
// BUG-2 (introducido): el evento del filtro no estaba enlazado.
//
//   ❌  <app-product-filter />
//
// fix(bug-2): se escucha (filterChange) y se llama onFilterChange().
//
// BUG-4 (introducido): el padre tenía el HTML del badge inline aquí.
//
// fix(bug-4): toda la lógica visual de la tarjeta vive en
//   ProductCardComponent; el contenedor solo compone.

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, ProductFilterComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  // El contenedor es dueño del estado
  private readonly searchTerm = signal('');

  readonly products: Product[] = [
    { id: 1, name: 'Laptop Pro 15',         price: 1299.99, stock: 10, category: 'Computadores' },
    { id: 2, name: 'Mouse Inalámbrico',     price: 29.99,  stock: 0,  category: 'Periféricos'  },
    { id: 3, name: 'Monitor 4K',            price: 299.99, stock: 5,  category: 'Periféricos'  },
    { id: 4, name: 'Teclado Mecánico',      price: 89.99,  stock: 3,  category: 'Periféricos'  },
    { id: 5, name: 'Auriculares Bluetooth', price: 59.99,  stock: 7,  category: 'Audio'        },
  ];

  // Lista derivada: se recalcula automáticamente cuando cambia searchTerm
  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  // fix(bug-2): el padre actualiza el estado cuando el hijo emite
  onFilterChange(term: string): void {
    this.searchTerm.set(term);
  }
}
