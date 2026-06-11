import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
    service = TestBed.inject(ProductService);
  });

  describe('getAll()', () => {
    it('retorna 5 productos', () => {
      const result = service.getAll();

      expect(result.length).toBe(5);
    });

    it('retorna una copia defensiva — mutar el resultado no afecta al servicio', () => {
      const first = service.getAll();
      first.push({ id: 99, name: 'Fake', price: 1, stock: 1, category: 'Test' });

      const second = service.getAll();

      expect(second.length).toBe(5);
    });
  });

  describe('findById()', () => {
    it('retorna Laptop Pro 15 para id 1', () => {
      const result = service.findById(1);

      expect(result?.name).toBe('Laptop Pro 15');
    });

    it('retorna undefined para un id inexistente', () => {
      const result = service.findById(99);

      expect(result).toBeUndefined();
    });
  });

  describe('filter()', () => {
    it('filtra por nombre ignorando mayúsculas y minúsculas', () => {
      const result = service.filter('LAPTOP', false);

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Laptop Pro 15');
    });

    it('retorna solo disponibles cuando onlyAvailable es true', () => {
      const result = service.filter('', true);

      expect(result.every(p => p.stock > 0)).toBeTrue();
    });

    it('retorna todos los productos con término vacío', () => {
      const result = service.filter('', false);

      expect(result.length).toBe(5);
    });
  });

  describe('isAvailable()', () => {
    it('retorna true cuando stock es mayor a 0', () => {
      const product = { id: 1, name: 'T', price: 10, stock: 5, category: 'X' };

      expect(service.isAvailable(product)).toBeTrue();
    });

    it('retorna false cuando stock es 0', () => {
      const product = { id: 2, name: 'T', price: 10, stock: 0, category: 'X' };

      expect(service.isAvailable(product)).toBeFalse();
    });
  });
});
