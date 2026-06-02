import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../models/product.model';

export type ApiMode = 'success' | 'error' | 'empty';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private readonly baseUrl = 'https://api.bugtrackershop.com';

  mode: ApiMode = 'success';

  private readonly mockData: Product[] = [
    { id: 1, name: 'Laptop Pro 15',         price: 1299.99, stock: 10, category: 'Computadores' },
    { id: 2, name: 'Mouse Inalámbrico',     price: 29.99,  stock: 0,  category: 'Periféricos'  },
    { id: 3, name: 'Monitor 4K',            price: 299.99, stock: 5,  category: 'Periféricos'  },
    { id: 4, name: 'Teclado Mecánico',      price: null as unknown as number, stock: 3, category: 'Periféricos' },
    { id: 5, name: 'Auriculares Bluetooth', price: 59.99,  stock: 7,  category: 'Audio'        },
  ];

  getProducts(category: string = 'Periféricos'): Observable<Product[]> {
    const url = `${this.baseUrl}/products?category=${encodeURIComponent(category)}`;
    console.log('[API] GET', url);

    if (this.mode === 'error') {
      return throwError(() => ({
        status: 500,
        message: 'Http failure response for https://api.bugtrackershop.com/products: 500 Internal Server Error',
      })).pipe(delay(1200));
    }

    if (this.mode === 'empty') {
      return of([]).pipe(delay(1200));
    }

    return of(this.mockData).pipe(delay(1200));
  }
}