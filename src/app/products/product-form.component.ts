import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly id = input<string>();

  readonly form = this.fb.group({
    name:     ['',   Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    stock:    [0,   Validators.required],
    category: ['',   Validators.required],
    active:   [true],
  });

  get isEditing(): boolean {
    return !!this.id();
  }

  ngOnInit(): void {
  if (this.isEditing) {
    const product = this.productService.findById(+this.id()!);
    if (product) {
      this.form.patchValue({
        name:     product.name,
        price:    product.price,
        stock:    product.stock,
        category: product.category,
        active:   true,
      });
    }
  }
}

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && (control.touched || control.dirty));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.value;
    console.log('Guardado:', raw);
    this.router.navigate(['/products']);
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}