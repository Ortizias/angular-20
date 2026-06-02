import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductApiService } from './product-api.service';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';
import { ProductCardComponent } from './product-card.component';
import { ProductFilterComponent } from './product-filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, ProductFilterComponent, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  private readonly apiService = inject(ProductApiService);
  readonly productService = inject(ProductService);

  readonly loading = signal(true);
  readonly products = signal<Product[]>([]);
  readonly errorMessage = signal('');
  readonly searchTerm = signal('');
  readonly showOnlyAvailable = signal(false);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const onlyAvailable = this.showOnlyAvailable();
    return this.products().filter((p) => {
      const matchesTerm =
        !term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
      return matchesTerm && (!onlyAvailable || this.productService.isAvailable(p));
    });
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.apiService.getProducts().subscribe({
      next: (data) => {
        this.loading.set(false);
        const normalized = data.map((p) => ({ ...p, price: p.price ?? 0 }));
        this.products.set(normalized);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 0) {
          this.errorMessage.set('Sin conexión. Revisa tu red e intenta de nuevo.');
        } else if (err.status >= 500) {
          this.errorMessage.set('Error en el servidor. Intenta más tarde.');
        } else {
          this.errorMessage.set('No se pudieron cargar los productos.');
        }
      },
    });
  }

  onFilterChange(term: string): void {
    this.searchTerm.set(term);
  }

  toggleAvailable(): void {
    this.showOnlyAvailable.update((v) => !v);
  }
}
