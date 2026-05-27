import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

// ─────────────────────────────────────────────────────────────
// BUG-2 (introducido): el @Output existía pero en el padre se
//   olvidó enlazarlo:
//
//   ❌  <app-product-filter />
//       (sin binding al evento → la lista nunca se actualiza)
//
// fix(bug-2): el padre DEBE escuchar el evento:
//   ✅  <app-product-filter (filterChange)="onFilterChange($event)" />
//
// Este componente tiene UNA única responsabilidad:
//   capturar texto del usuario y notificar al padre.
//   NO filtra la lista — eso le corresponde al contenedor.
// ─────────────────────────────────────────────────────────────

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
})
export class ProductFilterComponent {
  searchText = '';

  @Output() filterChange = new EventEmitter<string>();

  onInput(): void {
    // Emite cada vez que el usuario escribe
    this.filterChange.emit(this.searchText);
  }
}
