import { Component, computed, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  readonly productService = inject(ProductService);

  readonly id = input.required<string>();

  private readonly version = signal(0);

  readonly product = computed(() => {
    this.version();
    return this.productService.findById(+this.id());
  });

  reserve(): void {
    const p = this.product();
    if (p && this.productService.isAvailable(p)) {
      this.productService.reserve(p.id);
      this.version.update(v => v + 1);
    }
  }
}