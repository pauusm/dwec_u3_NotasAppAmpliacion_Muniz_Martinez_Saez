## NotasApp — DWEC U3 (Plantilla mínima)

## Resumen
Aplicación SPA para crear y gestionar notas desde cliente. Demuestra el uso de objetos nativos, APIs del navegador con JavaScript (navigator, location.hash, postMessage, localStorage), comunicación entre ventanas y generación dinámica del DOM.

## Objetivo
Implementar los requisitos funcionales establecidos: objetos nativos; navigator.language; filtros mediante location.hash; construcción dinámica de interfaz; viewport/scroll/pantalla completa; gestión de ventanas; persistencia; depuración y documentación.

## Contenido del repositorio
/ 
├─ index.html
├─ styles.css
├─ app.js
├─ panel.html
├─ GUIA_USUARIO.md
└─ README.md

## Instrucciones rápidas

1- Abrir index.html en un navegador moderno.
2- Añadir una nota introduciendo Texto, Fecha y Prioridad (1–3).
3- Navegar entre filtros usando #hoy, #semana, #todas.
4- Completar o borrar notas desde cada tarjeta.
5- Editar notas directamente desde la tarjeta (edición inline).
6- Exportar o importar notas en formato JSON.
7- Abrir el Panel Diario (popup) y consultar el snapshot sincronizado.
8- Activar el modo pantalla completa cuando sea necesario.

## Nuevas funcionalidades implementadas

1. **Edición inline de notas (Paula):**  
   Modificación directa de texto, fecha y prioridad desde la tarjeta. Validación automática y re-renderización sin refrescar.

2. **Validaciones avanzadas de formulario (Paula):**  
   Texto no vacío, fecha válida, prioridad 1–3. Bloqueo del envío si hay errores.

3. **Exportación e importación JSON (Alba):**  
   Exportación completa de notas y carga de archivos externos con doble validación.

4. **Snapshots (Alba):**  
   Guardado, restauración y listado de estados completos, persistidos en localStorage.

5. **Integración completa con la interfaz (Noemi):**  
   Render seguro mediante plantillas `<template>`.  
   Scroll automático hacia nuevas notas.

6. **Modo pantalla completa (Noemi):**  
   Control con Fullscreen API, con indicadores visuales.

7. **Mejoras de filtrado y ordenación (Noemi).**

8. **Generación dinámica segura con plantillas HTML (Noemi):**  
   Prevención de inyección HTML.

9. **Comunicación avanzada entre ventanas (Todas):**  
   postMessage() con validación estricta de origen.

---


## Justificación de persistencia

## Mecanismo elegido: **localStorage**

**Motivos principales:**

- Sin tráfico al servidor (privacidad).

- Suficiente capacidad (≈5 MB).

- Acceso simple (setItem, getItem).

- Buen soporte en navegadores modernos.

**Cookies descartadas:** limitadas, caducan y viajan en cada solicitud HTTP.

---

## Uso de objetos nativos

| Objeto | Ejemplo | Finalidad |
|--------|---------|-----------|
| Date   | Comprobar si la nota es de hoy/semana | Filtros y formateo |
| Math   | Math.min / Math.max | Validación de prioridad |
| String | .trim() | Validación de texto |
| Number | Number() | Conversión y validación numérica |

---

## Interacción con el navegador

- `navigator.language para formateo de fechas.

- `location.hash como enrutador simple para filtros.

- `window.open() para mostrar el Panel Diario.

- `postMessage() para enviar snapshots de forma segura.

- Fullscreen API para modo pantalla completa.

---

## Persistencia y comunicación

Ejemplo de snapshot transferido por postMessage():

```json
{
  "tipo": "SNAPSHOT",
  "marca": "2025-11-06T12:34:56.000Z",
  "filtro": "#semana",
  "notas": []
}

Matriz RA–CE

| RA / CE | Implementación |
|---------|----------------|
| Objetos nativos | Manejo de fechas (filtros), validación numérica, formateo internacional |
| Interacción con navegador | navigator.language, location.hash, eventos hashchange |
| Generación dinámica HTML | Plantillas `<template>`, render seguro, edición inline |
| Viewport / Scroll / Pantalla completa | Scroll automático, Fullscreen API |
| Ventanas y comunicación | window.open(), postMessage(), snapshot estructurado |
| Persistencia | localStorage, exportación/importación JSON, snapshots |
| Depuración | console.log, console.warn, validaciones con mensajes |


Probado en Chrome, Firefox y Edge.
Capturas incluidas en la carpeta correspondiente.

## Autores

Alba Martínez:

  RF9 — Persistencia local
  RF10 — Envío del snapshot al Panel
  Importación / Exportación JSON
  Sistema de Snapshots (guardar, cargar, listar, restaurar)

Paula Saez:

  RF7 - Ventana auxiliar (Panel diario) y comunicación controlada
  Comentarios
  Edición inline
  Validaciones completas (texto, fecha, prioridad)
  Guía de usuario
  

Noemi Muñiz:

  RF6 — Control de pantalla completa / viewport/sroll
  Mejoras de filtrado y ordenación
  Creación dinámica segura con <template>
  Integración completa UI 
  README 

Trabajo conjunto:

  Comunicación avanzada entre ventanas (postMessage)
  Sincronización Panel–App


© 2025-10-27 — DWEC



