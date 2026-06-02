import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from './product.service';
import { ProductCardComponent } from './product-card.component';
import { ProductFilterComponent } from './product-filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, ProductFilterComponent, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);

  readonly searchTerm = signal('');
  readonly showOnlyAvailable = signal(false);

  readonly filteredProducts = computed(() =>
    this.productService.filter(this.searchTerm(), this.showOnlyAvailable()),
  );

  onFilterChange(term: string): void {
    this.searchTerm.set(term);
  }

  toggleAvailable(): void {
    this.showOnlyAvailable.update((v) => !v);
  }
}
