// DWEC U3 — Plantilla mínima NotasApp

/** @typedef {{ id:string, texto:string, fecha:string, prioridad:number, completada?:boolean }} Nota */
const estado = {
  notas: /** @type {Nota[]} */ ([]),
  filtro: obtenerFiltroDesdeHash()
};
//=== Persistencia de datos ===
/**
 * Guarda el estado actual de la aplicación en localStorage.
 * @returns {void}
 */
function guardarEstado(){
try {
  //creamos objeto:
    const datos = {
      notas: estado.notas,
      filtro: estado.filtro
    };
    localStorage.setItem("tablon_estado", JSON.stringify(datos));
  } catch (err) {
    console.error("Error al guardar:", err);
  }
}

/**
 * Carga el estado almacenado desde localStorage.
 * Si los datos son inválidos, se elimina el almacenamiento.
 * @returns {void}
 */
function cargarEstado() {
  try {
    const raw = localStorage.getItem("tablon_estado");
    if (!raw) return;
    const datos = JSON.parse(raw);
    if (Array.isArray(datos.notas)) estado.notas = datos.notas;
    if (typeof datos.filtro === "string") estado.filtro = datos.filtro;
  } catch (err) {
    console.warn("Datos corruptos en localStorage. Se reinicia el estado.", err);
    localStorage.removeItem("tablon_estado");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //
  cargarEstado();
  document.querySelectorAll("nav [data-hash]").forEach(btn => {
    btn.addEventListener("click", () => { location.hash = btn.getAttribute("data-hash"); });
  });
  document.getElementById("formNota").addEventListener("submit", onSubmitNota);
  document.getElementById("btnPanelDiario").addEventListener("click", abrirPanelDiario);
  document.getElementById("btnPantallaCompleta").addEventListener("click", togglePantallaCompleta);
  //Botones importar/ exportar:
  document.getElementById("btnExportar").addEventListener("click", exportarNotas);
  const inputImportar = document.getElementById("inputImportar");
  document.getElementById("btnImportar").addEventListener("click", () => inputImportar.click());
  inputImportar.addEventListener("change", (e) => {
  const archivo = e.target.files[0];
  if (archivo) {
    importarNotas(archivo);
    e.target.value = "";
  }
});
  render();
});

window.addEventListener("hashchange", () => {
  estado.filtro = obtenerFiltroDesdeHash();
  render();
});

/**
 * Crea una nueva nota validando los datos recibidos.
 * @param {string} texto - Texto de la nota.
 * @param {string} fecha - Fecha de la nota en formato YYYY-MM-DD.
 * @param {number|string} prioridad - Nivel de prioridad (1–3).
 * @returns {Nota} Objeto de nota creada.
 * @throws {Error} Si los datos son inválidos.
 */
function crearNota(texto, fecha, prioridad) {
  const t = String(texto).trim();
  const p = Math.max(1, Math.min(3, Number(prioridad) || 1));
  const f = new Date(fecha);
  if (!t || Number.isNaN(f.getTime())) throw new Error("Datos de nota inválidos");
  return { id: "n" + Math.random().toString(36).slice(2), texto: t, fecha: f.toISOString().slice(0,10), prioridad: p };
}

/**
 * Obtiene el filtro activo a partir del hash de la URL.
 * @returns {string} Hash correspondiente al filtro actual.
 */
function obtenerFiltroDesdeHash() {
  const h = (location.hash || "#todas").toLowerCase();
  return ["#hoy","#semana","#todas"].includes(h) ? h : "#todas";
}

/**
 * Filtra las notas según el filtro seleccionado (#hoy, #semana o #todas).
 * @param {Nota[]} notas - Lista de notas a filtrar.
 * @returns {Nota[]} Notas filtradas.
 */
function filtrarNotas(notas) {
  const hoy = new Date(); const ymd = hoy.toISOString().slice(0,10);
  if (estado.filtro === "#hoy") return notas.filter(n => n.fecha === ymd);
  if (estado.filtro === "#semana") {
    const fin = new Date(hoy); fin.setDate(hoy.getDate() + 7);
    return notas.filter(n => new Date(n.fecha) >= hoy && new Date(n.fecha) <= fin);
  }
  return notas;
}

/**
 * Ordena las notas por prioridad, fecha y texto.
 * @param {Nota[]} notas - Array de notas a ordenar.
 * @returns {Nota[]} Notas ordenadas.
 */
function ordenarNotas(notas) {
  return [...notas].sort((a,b) =>
    b.prioridad - a.prioridad ||
    new Date(a.fecha) - new Date(b.fecha) ||
    a.texto.localeCompare(b.texto)
  );
}

/**
 * Renderiza las notas visibles en el contenedor principal.
 * @returns {void}
 */
function render() {
  const cont = document.getElementById("listaNotas");
  cont.innerHTML = "";
  const visibles = ordenarNotas(filtrarNotas(estado.notas));
  for (const n of visibles) {
    const card = document.createElement("article");
    card.className = "nota";
    card.innerHTML = `
      <header>
        <strong>[P${n.prioridad}] ${escapeHtml(n.texto)}</strong>
        <time datetime="${n.fecha}">${formatearFecha(n.fecha)}</time>
      </header>
      <footer>
        <button data-acc="completar" data-id="${n.id}">Completar</button>
        <button data-acc="borrar" data-id="${n.id}">Borrar</button>
      </footer>
    `;
    cont.appendChild(card);
  }
  cont.querySelectorAll("button[data-acc]").forEach(btn => btn.addEventListener("click", onAccionNota));
}

/**
 * Formatea una fecha ISO a formato legible localmente.
 * @param {string} ymd - Fecha en formato YYYY-MM-DD.
 * @returns {string} Fecha formateada según el idioma del navegador.
 */
function formatearFecha(ymd) {
  const d = new Date(ymd);
  return new Intl.DateTimeFormat(navigator.language || "es-ES", { dateStyle: "medium" }).format(d);
}

/**
 * Manejador del envío del formulario para crear una nueva nota.
 * @param {SubmitEvent} e - Evento del formulario.
 * @returns {void}
 */
function onSubmitNota(e) {
  e.preventDefault();
  const texto = document.getElementById("txtTexto").value;
  const fecha = document.getElementById("txtFecha").value;
  const prioridad = document.getElementById("selPrioridad").value;
  try {
    const nota = crearNota(texto, fecha, prioridad);
    estado.notas.push(nota);
    guardarEstado();
    e.target.reset();
    alert("Nota creada");
    render();
  } catch (err) { alert(err.message); }
}

/**
 * Gestiona las acciones sobre las notas (borrar o completar).
 * @param {MouseEvent} e - Evento del botón pulsado.
 * @returns {void}
 */
function onAccionNota(e) {
  const btn = e.currentTarget;
  const id = btn.getAttribute("data-id");
  const acc = btn.getAttribute("data-acc");
  const idx = estado.notas.findIndex(n => n.id === id);
  if (idx < 0) return;
  if (acc === "borrar" && confirm("¿Borrar la nota?")) estado.notas.splice(idx, 1)
    //
  guardarEstado();
  if (acc === "completar") estado.notas[idx].completada = true
  //
  guardarEstado();
  render();
}

// === Controlar el panel ===
/**
 * Abre el panel diario en una nueva ventana y envía las notas filtradas.
 * @returns {void}
 */

//Intenta abrir una ventana nueva. Si el navegador bloquea el popup, avisa al usuario.
function abrirPanelDiario() {
    //Abrir el panel desde la app principal
  const ref = window.open("panel.html", "PanelDiario", "width=420,height=560");
  // Si el navegador ha bloqueado el popup, window.open devuelve null o undefined
  if (!ref) { alert("Pop-up bloqueado. Permita ventanas emergentes."); return; } // avisa al usuario y salimos de la función
    
  //Envia los datos al panel (snapshot de notas filtradas)
  const snapshot = { tipo: "SNAPSHOT", notas: filtrarNotas(estado.notas) };
  //setTimeout: espera un poco a que la ventana cargue antes de enviar
// enviamos el objeto snapshot SOLO al mismo origen
   // si algo falla, 
  setTimeout(() => { try { ref.postMessage(snapshot, location.origin); } catch (err){
    console.error("Error enviando snapshot:", err);
  } }, 400);
}

//Escucha los mensajes desde el panel
window.addEventListener("message", (ev) => {
   //Validar origen
   if (ev.origin !== location.origin) return; // ignora mensajes de otros sitios
   
   // Validar que el contenido del mensaje exista y sea un objeto
   if (!ev.data || typeof ev.data !== "object") return;

// Guardamos el contenido del mensaje en la variable "mensaje" para trabajar con él
   const mensaje = ev.data;
   if(!mensaje.tipo) return; // si el objeto no tiene 'tipo', lo ignoramos (no es un mensaje válido)

   // Si el tipo es SNAPSHOT y notas es un array, renderizamos esas notas en la app principal
  if(mensaje.tipo === "SNAPSHOT" && Array.isArray(mensaje.notas)) {
    render();
  }


  //// Si el tipo es BORRADO, intentamos borrar la nota con el id recibido
  if (mensaje.tipo === "BORRADO") {
    const id = mensaje.id;
    if(id=== undefined) return; // si no hay id, no hacemos nada
    // Filtramos las notas para quitar la que tenga el id recibido
    estado.notas = estado.notas.filter(n => n.id !== id)
    guardarEstado(); // guardar los cambios en el almacenamiento
    render(); //Renderiza
  }
});

/**
 * Escapa caracteres HTML peligrosos en una cadena.
 * @param {string} s - Texto potencialmente inseguro.
 * @returns {string} Texto con caracteres HTML escapados.
 */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
}

// === Control de pantalla completa ===
/**
 * Activa o desactiva el modo de pantalla completa.
 * @returns {void}
 */
function togglePantallaCompleta() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    console.log("Pantalla completa desactivada");
  } else {
    document.documentElement.requestFullscreen();
    console.log("Pantalla completa activada");
  }
}

// === Gestión de la importación y exportación de archivos ===
/**
* Exportar notas en un archivo JSON para descargarlas
* @returns {void} Indica mediante un alert al ususario de su exportación o errores.
*/
function exportarNotas(){
  try{
    const datos = {
      //fecha de la exportación.
      timestamp: new Date().toISOString(),
      //lista de las notas.
      notas: estado.notas,
      filtro:estado.filtro
    };
    const binario = new Blob([JSON.stringify(datos)]); //hacer conversión a JSON.
    //Crear objeto binario: (https://developer.mozilla.org/en-US/docs/Web/API/Blob).
    const url = URL.createObjectURL(binario);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tablon_notas.json";
    //forzar descarga:
    a.click();
    URL.revokeObjectURL(url);//(revoke(permissionDescriptor))
    alert("Se han exportado los datos correctamente");
    
    }catch(err){
    console.error("error: ", err);
    alert("No se han podido exportar los datos correctamente.");
    }
  }

/**
* Importar notas desde un archivo JSON.
* @param {File} archivo que se selecciona.
* @returns {void} Indica mediante un alert al ususario si el archivo no sirve.
*/
function importarNotas(archivo){
  const leer = new FileReader();
  leer.onload = (e) => {
    try{
      //convertir a objeto
      const datos = JSON.parse(e.target.result);
      //verificar su formato:
      if(!Array.isArray(datos.notas))throw new Error ("El formato escogido es inválido.");
      estado.notas=datos.notas;
      if(typeof datos.filtro === "string"){
        estado.filtro = datos.filtro; 
      }
      //guardar estado en LS:
      guardarEstado();
        render();
        alert("Se han importado las notas.");
    }catch(err){
      console.error("Error: ", err);
      alert("Este archivo no es válido.");
    }
  };
  //leer como texto: (https://developer.mozilla.org/es/docs/Web/API/FileReader/readAsText) 
  leer.readAsText(archivo);
}

