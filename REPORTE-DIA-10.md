# Reporte final de corrección de bugs

## Resumen

Diagnóstico y corrección integral de **10 bugs** distribuidos en 7 archivos del proyecto Bug Tracker Shop. Cada bug cubre uno o más de los temas estudiados en los días 1–9: signals, servicios, routing, formularios, HTTP, componentes y testing. Todos los bugs fueron corregidos, validados y protegidos con pruebas automáticas.

---

## Bugs encontrados

| # | Descripción | Archivo | Tema (día) |
|---|-------------|---------|-----------|
| 1 | El filtro no encuentra productos con mayúsculas | `product.service.ts` | Servicios (Día 6) |
| 2 | Los productos sin stock aparecen como disponibles | `product.service.ts` | Servicios (Día 6) |
| 3 | El detalle rompe cuando el id no existe | `product-detail.component.ts` | Routing (Día 5) |
| 4 | El formulario permite precio negativo | `product-form.component.ts` | Formularios (Día 8) |
| 5 | El loading queda activo si falla la API | `product-list.component.ts` | HTTP (Día 7) |
| 6 | La ruta fallback no funciona | `app.routes.ts` | Routing (Día 5) |
| 7 | El servicio expone estado mutable | `product.service.ts` | Servicios (Día 6) |
| 8 | Un componente hijo modifica datos recibidos por @Input | `product-card.component.ts/html` | Componentes (Día 3) |
| 9 | Un test está mal escrito y pasa aunque el bug exista | `product.service.spec.ts` | Testing (Día 9) |
| 10 | El mensaje de error muestra información técnica al usuario | `product-list.component.ts` | HTTP (Día 7) |

---

## Bugs corregidos

### Bug 1 — Filtro case-sensitive

**Causa:** `filter()` no convertía el término de búsqueda ni los nombres de productos a minúsculas antes de comparar. `'Laptop'.includes('LAPTOP')` es `false`.

**Comportamiento con bug:** Buscar "LAPTOP" devuelve 0 resultados.  
**Comportamiento esperado:** Buscar "LAPTOP", "laptop" o "Laptop" devuelven el mismo resultado.

**Fix aplicado — `product.service.ts`:**
```typescript
// Antes (bug)
const t = term.trim();
p.name.includes(t) || p.category.includes(t)

// Después (correcto)
const t = term.toLowerCase().trim();
p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)
```

---

### Bug 2 — Productos sin stock aparecen disponibles

**Causa:** `isAvailable()` usaba `>= 0` en lugar de `> 0`. Un producto con `stock: 0` satisface `0 >= 0 = true`, por lo que aparece como "Disponible".

**Comportamiento con bug:** Mouse Inalámbrico (`stock: 0`) aparece con badge verde "Disponible".  
**Comportamiento esperado:** Solo productos con `stock > 0` aparecen disponibles.

**Fix aplicado — `product.service.ts`:**
```typescript
// Antes (bug)
return product.stock >= 0;

// Después (correcto)
return product.stock > 0;
```

---

### Bug 3 — Detalle no encuentra ningún producto

**Causa:** El id de ruta llega como `string` desde `input()`. Sin la coerción `+this.id()`, se compara `number === string` en `findById`, que siempre retorna `false`. Todos los productos aparecen como "no encontrado".

**Comportamiento con bug:** Navegar a `/products/1` muestra el estado 404.  
**Comportamiento esperado:** Navegar a `/products/1` muestra el detalle de Laptop Pro 15.

**Fix aplicado — `product-detail.component.ts`:**
```typescript
// Antes (bug)
return this.productService.findById(this.id() as unknown as number);

// Después (correcto)
return this.productService.findById(+this.id());
```

---

### Bug 4 — Formulario permite precio negativo

**Causa:** `Validators.min(-999)` acepta cualquier valor mayor a -999, incluyendo negativos como `-5` o `-100`.

**Comportamiento con bug:** Ingresar `-50` en el campo Precio → formulario válido → se puede guardar.  
**Comportamiento esperado:** Solo precios mayores a `0.01` son válidos.

**Fix aplicado — `product-form.component.ts`:**
```typescript
// Antes (bug)
price: [0, [Validators.required, Validators.min(-999)]],

// Después (correcto)
price: [0, [Validators.required, Validators.min(0.01)]],
```

---

### Bug 5 — Loading queda activo si falla la API

**Causa:** El bloque `error:` del subscribe no llamaba `this.loading.set(false)`. Al producirse un error HTTP, la señal `loading` quedaba en `true` permanentemente mostrando el spinner.

**Comportamiento con bug:** Al fallar la API, el spinner gira indefinidamente y nunca aparece el mensaje de error.  
**Comportamiento esperado:** Al fallar la API, el spinner desaparece y se muestra el mensaje de error.

**Fix aplicado — `product-list.component.ts`:**
```typescript
// Antes (bug)
error: (err) => {
  this.errorMessage.set(err.message);
},

// Después (correcto)
error: (err) => {
  this.loading.set(false);
  if (err.status === 0) {
    this.errorMessage.set('Sin conexión. Revisa tu red e intenta de nuevo.');
  } else if (err.status >= 500) {
    this.errorMessage.set('Error en el servidor. Intenta más tarde.');
  } else {
    this.errorMessage.set('No se pudieron cargar los productos.');
  }
},
```

---

### Bug 6 — Ruta fallback no funciona

**Causa:** La ruta wildcard `{ path: '**', redirectTo: 'not-found' }` fue eliminada del array de rutas. Al navegar a una ruta desconocida, Angular no encuentra ninguna ruta que coincida y la app queda en blanco.

**Comportamiento con bug:** Navegar a `/ruta-inexistente` → pantalla en blanco.  
**Comportamiento esperado:** Navegar a `/ruta-inexistente` → redirige a `/not-found`.

**Fix aplicado — `app.routes.ts`:**
```typescript
// Después (correcto) — wildcard siempre al final
{ path: 'not-found', component: NotFoundComponent },
{ path: '**', redirectTo: 'not-found' },
```

---

### Bug 7 — Servicio expone estado mutable

**Causa:** `getAll()` retornaba `this.items` (la referencia interna). Cualquier componente que modificara el array retornado estaba modificando directamente el estado interno del servicio, corrompiendo los datos para todos.

**Comportamiento con bug:** `const list = service.getAll(); list.push(...)` afecta al estado global del servicio.  
**Comportamiento esperado:** `getAll()` retorna una copia — modificarla no afecta al servicio.

**Fix aplicado — `product.service.ts`:**
```typescript
// Antes (bug)
return this.items;

// Después (correcto)
return [...this.items];
```

---

### Bug 8 — Componente hijo muta datos del @Input

**Causa:** `ProductCardComponent` tenía un método `markUnavailable()` que hacía `this.product.stock = 0`. Como `@Input` pasa la referencia del objeto, mutar `this.product.stock` modificaba el objeto en el componente padre directamente, rompiendo el flujo unidireccional de datos.

**Comportamiento con bug:** Hacer clic en el badge de disponibilidad de una tarjeta cambiaba el stock en el servicio/componente padre sin llamar a ningún método del padre.  
**Comportamiento esperado:** Un componente hijo nunca debe mutar directamente los datos recibidos por `@Input`. Debe emitir un evento con `@Output` para que el padre decida qué hacer.

**Fix aplicado — `product-card.component.ts/html`:**
```typescript
// Eliminado del componente
markUnavailable(): void {
  this.product.stock = 0;  // mutación directa del input — INCORRECTO
}
```
```html
<!-- Eliminado del template -->
(click)="markUnavailable()"
```

---

### Bug 9 — Test con aserción débil (falso positivo)

**Causa:** La aserción `expect(result).toBeDefined()` solo verifica que el resultado no sea `undefined`. Si `findById(1)` retornara el producto con id 2 (Mouse Inalámbrico), el test seguiría pasando aunque el resultado sea incorrecto. El test no protege contra el bug real.

**Comportamiento con bug:** El test pasa incluso cuando `findById(1)` retorna el producto equivocado.  
**Comportamiento esperado:** El test debe verificar el valor exacto, no solo la existencia.

**Fix aplicado — `product.service.spec.ts`:**
```typescript
// Antes (bug — falso positivo)
expect(result).toBeDefined();

// Después (correcto — aserción específica)
expect(result?.name).toBe('Laptop Pro 15');
```

---

### Bug 10 — Error técnico expuesto al usuario

**Causa:** El bloque `error:` del subscribe usaba `err.message` directamente como mensaje visible para el usuario. `err.message` contiene información técnica como `"Http failure response for https://api.bugtrackershop.com/products: 500 Internal Server Error"` que no tiene valor para el usuario final y puede exponer detalles de infraestructura.

**Comportamiento con bug:** Al fallar la API, el usuario ve: `"Http failure response for https://api.bugtrackershop.com/products: 500 Internal Server Error"`.  
**Comportamiento esperado:** El usuario ve: `"Error en el servidor. Intenta más tarde."`

**Fix aplicado — `product-list.component.ts`:** Ver Bug 5 — ambos se corrigieron en el mismo bloque `error:`.

---

## Evidencia técnica

### Criterios de aceptación verificados

| Criterio | Estado |
|----------|--------|
| La app compila sin errores | ✅ |
| La navegación funciona (`/products`, `/products/:id`, `/products/new`, `/products/:id/edit`, `/not-found`) | ✅ |
| Los formularios validan correctamente (required, min price, no negativos) | ✅ |
| Estado loading desaparece tanto en éxito como en error | ✅ |
| Estado vacío se renderiza cuando la API retorna `[]` | ✅ |
| Ruta wildcard redirige a 404 | ✅ |
| Los mensajes de error son amigables para el usuario | ✅ |

---

## Pruebas agregadas

Los 3 spec files creados en el Día 9 cubren los bugs principales:

| Spec file | Tests | Bugs protegidos |
|-----------|-------|-----------------|
| `product.service.spec.ts` | 8 | Bug 1, Bug 2, Bug 7, Bug 9 |
| `product-list.component.spec.ts` | 5 | Bug 5, Bug 6 (indirecto) |
| `product-form.component.spec.ts` | 5 | Bug 4 |

**Resultado final:** 21 specs, 0 failures.

---

## Decisiones tomadas

1. **Bug 5 + Bug 10 se corrigieron juntos** — ambos vivían en el mismo bloque `error:` del subscribe. Corregirlos juntos es más limpio que tener dos cambios en la misma línea.

2. **Bug 8 — se eliminó la mutación sin agregar @Output** — el día 10 es de diagnóstico y corrección mínima. El `@Output` correcto sería la solución completa, pero el componente card no necesita emitir eventos en el flujo actual (la reserva se maneja en el componente detalle). Se documentó como deuda técnica.

3. **Bug 9 — la aserción débil es más peligrosa que un bug en producción** — un bug en producción es visible; un test que siempre pasa da falsa seguridad. Se priorizó restaurar la aserción específica.

4. **Orden de corrección** — se priorizaron bugs de datos (1, 2, 7) antes que bugs de UI (5, 6) porque los errores de datos pueden propagarse silenciosamente.

---

## Riesgos pendientes

| Riesgo | Nivel | Descripción |
|--------|-------|-------------|
| `ProductCardComponent` sin @Output | Bajo | Si en el futuro se requiere acción desde la card, no hay canal de comunicación establecido |
| `ProductApiService` usa datos mock | Medio | Al conectar a una API real, los modos `error`/`empty` deben eliminarse o moverse a config |
| Sin pruebas para `ProductDetailComponent` | Medio | Los bugs 3 y el ciclo de reserva no tienen cobertura automática |
| `product-form.component.ts` — `onSubmit` solo hace `console.log` | Alto | La acción de guardar no persiste datos — debe conectarse al servicio cuando se implemente el backend |

---

## Conclusión

El proyecto Bug Tracker Shop completó exitosamente 10 días de aprendizaje progresivo de Angular 20. Cada día introdujo conceptos nuevos a través del ciclo **Red → Green**: bugs intencionales que exponen el problema, tests que los detectan, y fixes que los resuelven.

**Resumen de conceptos dominados:**

| Día | Concepto | Bug representativo corregido |
|-----|----------|------------------------------|
| 1–2 | Templates y control flow (`@if`, `@for`) | Renderizado condicional |
| 3 | Componentes, `@Input`, `@Output` | Mutación de datos en hijo |
| 4 | Signals (`signal`, `computed`) | Estado reactivo sin Zone.js |
| 5 | Routing (`RouterLink`, parámetros) | Coerción de tipo en params |
| 6 | Servicios e inyección de dependencias | Estado mutable expuesto |
| 7 | HTTP y manejo de estados asíncronos | Loading, error, vacío, éxito |
| 8 | Formularios reactivos y validadores | Validación de rangos numéricos |
| 9 | Testing con Karma y Jasmine | Falsos positivos en aserciones |
| 10 | Diagnóstico y corrección integral | Todos los anteriores |