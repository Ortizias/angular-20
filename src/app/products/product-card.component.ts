import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../models/product.model';

// ─────────────────────────────────────────────────────────────
// BUG-3 (introducido): el componente mutaba directamente el @Input
//
//   ❌  this.product.name = this.product.name.toUpperCase();
//       Esto modifica el objeto original en el padre, rompiendo
//       el flujo unidireccional de datos.
//
// fix(bug-3): el hijo nunca escribe sobre sus @Input.
//   Si se necesita transformar el dato, se usa una propiedad
//   derivada local (computed / getter) o se emite un evento
//   para que el padre decida el cambio.
//
// BUG-4 (introducido): la lógica visual del badge estaba en
//   el template del padre (app.html), mezclando responsabilidades.
//
// fix(bug-4): toda la presentación de UN producto vive aquí.
//   El padre solo itera la lista; el hijo sabe cómo dibujarse.
// ─────────────────────────────────────────────────────────────

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  // fix(bug-1): required:true hace que Angular avise en compilación
  // si el padre olvida pasar el @Input, evitando product=undefined
  // en tiempo de ejecución.
  @Input({ required: true }) product!: Product;

  // fix(bug-3): propiedad DERIVADA (getter puro, no muta el input)
  get displayName(): string {
    return this.product.name.toUpperCase();
  }
}
