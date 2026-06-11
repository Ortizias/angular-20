import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductFormComponent } from './product-form.component';

describe('ProductFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
      ],
    }).compileComponents();
  });

  it('se crea correctamente', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('botón Guardar está deshabilitado cuando el formulario es inválido', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-save');

    expect(button.disabled).toBeTrue();
  });

  it('price = 0 hace el control inválido', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    fixture.detectChanges();
    const control = fixture.componentInstance.form.get('price')!;

    control.setValue(0);

    expect(control.valid).toBeFalse();
  });

  it('price = -10 hace el control inválido', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    fixture.detectChanges();
    const control = fixture.componentInstance.form.get('price')!;

    control.setValue(-10);

    expect(control.valid).toBeFalse();
  });

  it('price = 9.99 hace el control válido', () => {
    const fixture = TestBed.createComponent(ProductFormComponent);
    fixture.detectChanges();
    const control = fixture.componentInstance.form.get('price')!;

    control.setValue(9.99);

    expect(control.valid).toBeTrue();
  });
});
