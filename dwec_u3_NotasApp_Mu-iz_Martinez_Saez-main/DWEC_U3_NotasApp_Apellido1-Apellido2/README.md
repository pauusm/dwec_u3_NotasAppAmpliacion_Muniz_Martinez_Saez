## NotasApp — DWEC U3 (Plantilla mínima)

## Resumen
Aplicación SPA para crear y gestionar notas desde cliente. Demuestra el uso de objetos nativos, APIs del navegador con JavaScript (navigator, location.hash, postMessage, localStorage), comunicación entre ventanas y generación dinámica del DOM.

## Objetivo
Implementar los requisitos funcionales establecidos: objetos nativos; navigator.language; filtros mediante location.hash; construcción dinámica de interfaz; viewport/scroll/pantalla completa; gestión de ventanas; persistencia; depuración y documentación.

## Contenido del repositorio
/ (raíz)
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
1. Edición inline de notas (Paula):
  Permite modificar texto, fecha y prioridad directamente en la tarjeta.
  Validación automática al confirmar cambios.
  Re-renderización segura del DOM sin refrescar la página.

2. Validaciones avanzadas de formulario (Paula):
  Validación estricta de texto (no vacío).
  Comprobación de formato y futuro de fecha.
  Prioridad limitada entre 1 y 3.
  Sistema de aviso visual y bloqueo si hay errores.

3. Exportación e importación JSON (Alba):
  Exportación completa de notas a .json.
  Carga de fichero externo con notas nuevas.
  Doble validación del JSON importado para evitar datos corruptos.

4. Snapshots (guardar, cargar, restaurar, listar) (Alba):
  Guardado manual de estados completos.
  Restauración instantánea del estado elegido.
  Listado dinámico de snapshots disponibles.
  Persistencia en localStorage.

5. Integración completa con la interfaz (Noemi):
  Render dinámico con plantillas HTML seguras.
  Scroll automático hacia la nueva nota.

6. Modo pantalla completa (Noemi)
  Entrada y salida controlada con requestFullscreen() / exitFullscreen().
  Indicadores visuales y compatibilidad con navegadores modernos.

7. Mejoras de filtrado y ordenación (Noemi)
   Lógica centralizada para evitar duplicación.

8. Generación dinámica segura con plantillas (Noemi)
  Uso de elementos clonados desde <template>.
  Prevención de inyección HTML.
  Estructura consistente de tarjetas.

9. Comunicación avanzada entre ventanas (Todas)

postMessage() mejorado con validación estricta de origen.

Envío de snapshot en tiempo real al panel.

Sincronización automática al cambiar filtro.

##Justificación de persistencia

## Mecanismo elegido: localStorage

Motivos principales:

Sin tráfico al servidor (privacidad).

Suficiente capacidad (≈5 MB).

Acceso simple (setItem, getItem).

Buen soporte en navegadores modernos.

Cookies descartadas: limitadas, caducan y viajan en cada solicitud HTTP.

## Uso de objetos nativos
Objeto	Ejemplo	Finalidad
Date	Calcular si una nota es de hoy/semana	Filtros y formateo
Math	Math.min/Math.max	Validación de prioridad
String	.trim()	Validación de texto
Number	Number()	Validación y conversión
Interacción con el navegador

navigator.language para formateo de fechas.

location.hash como enrutador simple para filtros.

window.open() para mostrar el Panel Diario.

postMessage() para enviar snapshots de forma segura.

Fullscreen API para modo pantalla completa.

Persistencia y comunicación

Ejemplo de snapshot transferido por postMessage():

{
  tipo: "SNAPSHOT",
  marca: "2025-11-06T12:34:56.000Z",
  filtro: "#semana",
  notas: [ ... ]
}

## Matriz RA–CE (actualizada)
RA / CE	Implementación
Objetos nativos	Manejo de fechas (filtros), validación numérica, formateo internacional
Interacción con navegador	navigator.language, location.hash, eventos hashchange
Generación dinámica HTML	Plantillas <template> (Noemi), render seguro, edición inline
Viewport / Scroll / Pantalla completa	Scroll automático (Paula), Fullscreen API (Noemi)
Ventanas y comunicación	window.open(), postMessage(), envío estructurado de snapshots (Todas)
Persistencia	localStorage, exportación/importación JSON (Alba), snapshots (Alba)
Depuración	console.log, console.warn, validaciones con mensajes claros
Depuración y evidencias

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
    README
    GUIA DE USUARIO


