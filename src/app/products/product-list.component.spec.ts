import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductApiService } from './product-api.service';
import { ProductListComponent } from './product-list.component';

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop Pro 15',     price: 1299.99, stock: 10, category: 'Computadores' },
  { id: 2, name: 'Mouse Inalámbrico', price: 29.99,   stock: 0,  category: 'Periféricos'  },
];

describe('ProductListComponent', () => {
  let mockApi: jasmine.SpyObj<ProductApiService>;

  beforeEach(async () => {
    mockApi = jasmine.createSpyObj('ProductApiService', ['getProducts']);
    mockApi.getProducts.and.returnValue(of(MOCK_PRODUCTS));

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ProductApiService, useValue: mockApi },
      ],
    }).compileComponents();
  });

  it('se crea correctamente', async () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renderiza los items de la lista tras cargar', async () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.product-list li');

    expect(items.length).toBe(2);
  });

  it('muestra .state-empty cuando la lista está vacía', async () => {
    mockApi.getProducts.and.returnValue(of([]));
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.state-empty');

    expect(empty).not.toBeNull();
  });

  it('muestra .state-error cuando la API falla', async () => {
    mockApi.getProducts.and.returnValue(throwError(() => ({ status: 500 })));
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.state-error');

    expect(error).not.toBeNull();
  });

  it('filteredProducts filtra por searchTerm', async () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.searchTerm.set('laptop');
    fixture.detectChanges();

    expect(fixture.componentInstance.filteredProducts().length).toBe(1);
  });
});
