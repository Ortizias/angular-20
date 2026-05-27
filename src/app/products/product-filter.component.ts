import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';



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
    this.filterChange.emit(this.searchText);
  }
}
