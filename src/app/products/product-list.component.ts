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

  readonly products = signal(this.productService.getAll());
  readonly searchTerm = signal('');
  readonly showOnlyAvailable = signal(false);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const onlyAvailable = this.showOnlyAvailable();
    return this.products().filter(p => {
      const matchesTerm = !term ||
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term);
      const matchesAvailability = !onlyAvailable || this.productService.isAvailable(p);
      return matchesTerm && matchesAvailability;
    });
  });

  onFilterChange(term: string): void {
    this.searchTerm.set(term);
  }

  toggleAvailable(): void {
    this.showOnlyAvailable.update(v => !v);
  }
}