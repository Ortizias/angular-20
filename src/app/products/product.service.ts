import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly items: Product[] = [
    { id: 1, name: 'Laptop Pro 15',         price: 1299.99, stock: 10, category: 'Computadores' },
    { id: 2, name: 'Mouse Inalámbrico',     price: 29.99,  stock: 0,  category: 'Periféricos'  },
    { id: 3, name: 'Monitor 4K',            price: 299.99, stock: 5,  category: 'Periféricos'  },
    { id: 4, name: 'Teclado Mecánico',      price: 89.99,  stock: 3,  category: 'Periféricos'  },
    { id: 5, name: 'Auriculares Bluetooth', price: 59.99,  stock: 7,  category: 'Audio'        },
  ];

  getAll(): Product[] {
    return [...this.items];
  }

  findById(id: number): Product | undefined {
    return this.items.find(p => p.id === id);
  }

  filter(term: string, onlyAvailable: boolean): Product[] {
    const t = term.toLowerCase().trim();
    return this.items.filter(p => {
      const matchesTerm = !t ||
        p.name.toLowerCase().includes(t) ||
        p.category.toLowerCase().includes(t);
      const matchesAvailability = !onlyAvailable || this.isAvailable(p);
      return matchesTerm && matchesAvailability;
    });
  }

  isAvailable(product: Product): boolean {
    return product.stock > 0;
  }

  reserve(id: number): void {
    const product = this.items.find(p => p.id === id);
    if (product && product.stock > 0) {
      product.stock--;
    }
  }
}