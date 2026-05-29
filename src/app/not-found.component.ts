import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h2>404</h2>
      <p>Página no encontrada.</p>
      <a [routerLink]="['/products']">← Ir al catálogo</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 4rem 0;
    }
    .not-found h2 { font-size: 4rem; color: #1a237e; margin: 0; }
    .not-found p  { color: #666; margin: 1rem 0; }
    .not-found a  { color: #1a237e; text-decoration: none; font-weight: 600; }
    .not-found a:hover { text-decoration: underline; }
  `],
})
export class NotFoundComponent {}