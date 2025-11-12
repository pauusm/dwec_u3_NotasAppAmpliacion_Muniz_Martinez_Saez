# NotasApp — DWEC U3 (Plantilla mínima)

**Resumen**  
Aplicación SPA mínima para crear y gestionar notas/recordatorios desde cliente. Implementa y demuestra el uso de objetos nativos de JavaScript, APIs del navegador (`navigator`, `location.hash`, `postMessage`, `localStorage`) y generación dinámica del DOM.

**Objetivo**: implementar los RF acordados (objetos nativos; `navigator.language`; filtros por `location.hash`; generación de HTML; viewport/scroll/pantalla completa cuando proceda; `window.open`+comunicación controlada; persistencia elegida y justificada; depuración/documentación).

## Contenido del repositorio
/ (raíz)
├─ index.html
├─ styles.css
├─ app.js
├─ panel.html
├─ GUIA_USUARIO.md
└─ README.md


## Instrucciones rápidas
1. Abrir `src/index.html` en un navegador moderno.
2. Completar la lógica según los RF (ver enunciado de la UD).
3. Añadir evidencias de depuración (capturas) en este README o en la carpeta que decidas.
4. Añadir una nota rellenando **Texto**, **Fecha** y seleccionando **Prioridad (1–3)**.  
5. Usar los botones de navegación para cambiar el filtro: `#hoy`, `#semana`, `#todas`.  
6. Desde cada tarjeta de nota se puede **Completar** o **Borrar**.  
7. Abrir **Panel Diario** para ver un snapshot de las notas filtradas en otra ventana (popup). 

## Justificación de persistencia (rellenar)
- **Mecanismo elegido:** `localStorage` (Web Storage).  
- **Motivo:**
  - No se envía al servidor (mayor privacidad).  
  - Permite almacenar más datos (~5 MB).  
  - Es más simple de manejar que cookies (`setItem` / `getItem`).  
  - No caduca automáticamente.  
  - Totalmente soportado por navegadores modernos.
- **Cookies** descartadas porque:
  - Envían los datos en cada petición HTTP.  
  - Están limitadas a ~4 KB.  
  - No son necesarias sin comunicación con servidor.

## Uso de objetos nativos
| Objeto | Ejemplo en el código | Finalidad |
|--------|----------------------|------------|
| **Date** | `new Date(fecha)` / `Intl.DateTimeFormat` | Comparar y formatear fechas |
| **Math** | `Math.max(1, Math.min(3, prioridad))` | Limitar prioridad entre 1 y 3 |
| **String** | `String(texto).trim()` / `escapeHtml()` | Validar y limpiar texto |
| **Number** | `Number(prioridad)` | Convertir cadenas a números |

## Interacción con el navegador
- `navigator.language` → adapta el formato de fecha al idioma del usuario.  
- `location.hash` → controla el filtro activo (`#hoy`, `#semana`, `#todas`) sin recargar la página.  
- `window.open()` + `postMessage()` → abre el **Panel Diario** y envía los datos filtrados al popup.  

---

## Persistencia y comunicación
- `localStorage` conserva las notas y el filtro activo entre sesiones.  
- El snapshot JSON enviado al panel incluye:
  ```js
  {
    tipo: "SNAPSHOT",
    marca: "2025-11-06T12:34:56.000Z",
    filtro: "#semana",
    notas: [ ... ]
  }


## Matriz RA–CE (referenciar funciones/flujo)
- RA/CE	Implementación / evidencia
- Objetos nativos	crearNota(), formatearFecha(), ordenarNotas()
- Interacción navegador	navigator.language, location.hash
- Generación dinámica de HTML	render() usa createElement y innerHTML seguro
- Viewport / Scroll	Desplazamiento automático al añadir nota
- Ventanas y comunicación	abrirPanelDiario() + postMessage() + validación de origen
- Persistencia	localStorage (guardarEstado() / cargarEstado())
- Depuración	console.log / console.warn y capturas en README

## Depuración y evidencias

Probado en Chrome, Firefox, Edge.

## Autores:
- Alba Martinez:
    RF9
    RF10
  
- Paula Saez:
    RF7
    Comentarios
  
- Noemi Muñiz:
    RF6 - # NotasApp — DWEC U3 (Plantilla mínima)

**Resumen**  
Aplicación SPA mínima para crear y gestionar notas/recordatorios desde cliente. Implementa y demuestra el uso de objetos nativos de JavaScript, APIs del navegador (`navigator`, `location.hash`, `postMessage`, `localStorage`) y generación dinámica del DOM.

**Objetivo**: implementar los RF acordados (objetos nativos; `navigator.language`; filtros por `location.hash`; generación de HTML; viewport/scroll/pantalla completa cuando proceda; `window.open`+comunicación controlada; persistencia elegida y justificada; depuración/documentación).

## Contenido del repositorio
/ (raíz)
├─ index.html
├─ styles.css
├─ app.js
├─ panel.html
├─ GUIA_USUARIO.md
└─ README.md


## Instrucciones rápidas
1. Abrir `src/index.html` en un navegador moderno.
2. Completar la lógica según los RF (ver enunciado de la UD).
3. Añadir evidencias de depuración (capturas) en este README o en la carpeta que decidas.
4. Añadir una nota rellenando **Texto**, **Fecha** y seleccionando **Prioridad (1–3)**.  
5. Usar los botones de navegación para cambiar el filtro: `#hoy`, `#semana`, `#todas`.  
6. Desde cada tarjeta de nota se puede **Completar** o **Borrar**.  
7. Abrir **Panel Diario** para ver un snapshot de las notas filtradas en otra ventana (popup). 

## Justificación de persistencia (rellenar)
- **Mecanismo elegido:** `localStorage` (Web Storage).  
- **Motivo:**
  - No se envía al servidor (mayor privacidad).  
  - Permite almacenar más datos (~5 MB).  
  - Es más simple de manejar que cookies (`setItem` / `getItem`).  
  - No caduca automáticamente.  
  - Totalmente soportado por navegadores modernos.
- **Cookies** descartadas porque:
  - Envían los datos en cada petición HTTP.  
  - Están limitadas a ~4 KB.  
  - No son necesarias sin comunicación con servidor.

## Uso de objetos nativos
| Objeto | Ejemplo en el código | Finalidad |
|--------|----------------------|------------|
| **Date** | `new Date(fecha)` / `Intl.DateTimeFormat` | Comparar y formatear fechas |
| **Math** | `Math.max(1, Math.min(3, prioridad))` | Limitar prioridad entre 1 y 3 |
| **String** | `String(texto).trim()` / `escapeHtml()` | Validar y limpiar texto |
| **Number** | `Number(prioridad)` | Convertir cadenas a números |

## Interacción con el navegador
- `navigator.language` → adapta el formato de fecha al idioma del usuario.  
- `location.hash` → controla el filtro activo (`#hoy`, `#semana`, `#todas`) sin recargar la página.  
- `window.open()` + `postMessage()` → abre el **Panel Diario** y envía los datos filtrados al popup.  

---

## Persistencia y comunicación
- `localStorage` conserva las notas y el filtro activo entre sesiones.  
- El snapshot JSON enviado al panel incluye:
  ```js
  {
    tipo: "SNAPSHOT",
    marca: "2025-11-06T12:34:56.000Z",
    filtro: "#semana",
    notas: [ ... ]
  }


## Matriz RA–CE (referenciar funciones/flujo)
- RA/CE	Implementación / evidencia
- Objetos nativos	crearNota(), formatearFecha(), ordenarNotas()
- Interacción navegador	navigator.language, location.hash
- Generación dinámica de HTML	render() usa createElement y innerHTML seguro
- Viewport / Scroll	Desplazamiento automático al añadir nota
- Ventanas y comunicación	abrirPanelDiario() + postMessage() + validación de origen
- Persistencia	localStorage (guardarEstado() / cargarEstado())
- Depuración	console.log / console.warn y capturas en README

## Depuración y evidencias

Probado en Chrome, Firefox, Edge.

## Autores:
- Alba Martinez:
    RF9
    RF10
  
- Paula Saez:
    RF7
    Comentarios
  
- Noemi Muñiz:
    RF6 - # NotasApp — DWEC U3 (Plantilla mínima)

**Resumen**  
Aplicación SPA mínima para crear y gestionar notas/recordatorios desde cliente. Implementa y demuestra el uso de objetos nativos de JavaScript, APIs del navegador (`navigator`, `location.hash`, `postMessage`, `localStorage`) y generación dinámica del DOM.

**Objetivo**: implementar los RF acordados (objetos nativos; `navigator.language`; filtros por `location.hash`; generación de HTML; viewport/scroll/pantalla completa cuando proceda; `window.open`+comunicación controlada; persistencia elegida y justificada; depuración/documentación).

## Contenido del repositorio
/ (raíz)
├─ index.html
├─ styles.css
├─ app.js
├─ panel.html
├─ GUIA_USUARIO.md
└─ README.md


## Instrucciones rápidas
1. Abrir `src/index.html` en un navegador moderno.
2. Completar la lógica según los RF (ver enunciado de la UD).
3. Añadir evidencias de depuración (capturas) en este README o en la carpeta que decidas.
4. Añadir una nota rellenando **Texto**, **Fecha** y seleccionando **Prioridad (1–3)**.  
5. Usar los botones de navegación para cambiar el filtro: `#hoy`, `#semana`, `#todas`.  
6. Desde cada tarjeta de nota se puede **Completar** o **Borrar**.  
7. Abrir **Panel Diario** para ver un snapshot de las notas filtradas en otra ventana (popup). 

## Justificación de persistencia (rellenar)
- **Mecanismo elegido:** `localStorage` (Web Storage).  
- **Motivo:**
  - No se envía al servidor (mayor privacidad).  
  - Permite almacenar más datos (~5 MB).  
  - Es más simple de manejar que cookies (`setItem` / `getItem`).  
  - No caduca automáticamente.  
  - Totalmente soportado por navegadores modernos.
- **Cookies** descartadas porque:
  - Envían los datos en cada petición HTTP.  
  - Están limitadas a ~4 KB.  
  - No son necesarias sin comunicación con servidor.

## Uso de objetos nativos
| Objeto | Ejemplo en el código | Finalidad |
|--------|----------------------|------------|
| **Date** | `new Date(fecha)` / `Intl.DateTimeFormat` | Comparar y formatear fechas |
| **Math** | `Math.max(1, Math.min(3, prioridad))` | Limitar prioridad entre 1 y 3 |
| **String** | `String(texto).trim()` / `escapeHtml()` | Validar y limpiar texto |
| **Number** | `Number(prioridad)` | Convertir cadenas a números |

## Interacción con el navegador
- `navigator.language` → adapta el formato de fecha al idioma del usuario.  
- `location.hash` → controla el filtro activo (`#hoy`, `#semana`, `#todas`) sin recargar la página.  
- `window.open()` + `postMessage()` → abre el **Panel Diario** y envía los datos filtrados al popup.  

---

## Persistencia y comunicación
- `localStorage` conserva las notas y el filtro activo entre sesiones.  
- El snapshot JSON enviado al panel incluye:
  ```js
  {
    tipo: "SNAPSHOT",
    marca: "2025-11-06T12:34:56.000Z",
    filtro: "#semana",
    notas: [ ... ]
  }


## Matriz RA–CE (referenciar funciones/flujo)
- RA/CE	Implementación / evidencia
- Objetos nativos	crearNota(), formatearFecha(), ordenarNotas()
- Interacción navegador	navigator.language, location.hash
- Generación dinámica de HTML	render() usa createElement y innerHTML seguro
- Viewport / Scroll	Desplazamiento automático al añadir nota
- Ventanas y comunicación	abrirPanelDiario() + postMessage() + validación de origen
- Persistencia	localStorage (guardarEstado() / cargarEstado())
- Depuración	console.log / console.warn y capturas en README

## Depuración y evidencias

Probado en Chrome, Firefox, Edge.

## Autores:
- Alba Martinez:
    RF9 - Persistencia local
    RF10 - Envío de “snapshot” de datos al Panel
  
- Paula Saez:
    RF7 - Ventana auxiliar (Panel diario) y comunicación controlada
    Comentarios
  
- Noemi Muñiz:
    RF6 - Control básico de viewport/scroll/pantalla completa
    README
    GUIA DE USUARIO

© 2025-10-27 — DWEC
    README
    GUIA DE USUARIO

© 2025-10-27 — DWEC
    README
    GUIA DE USUARIO

© 2025-10-27 — DWEC
