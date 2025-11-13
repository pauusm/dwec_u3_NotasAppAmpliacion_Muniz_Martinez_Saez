// DWEC U3 — Plantilla mínima NotasApp

//Declaramos un objeto
/** @typedef {{ id:string, texto:string, fecha:string, prioridad:number, completada?:boolean }} Nota */
const estado = {
  //notas: es una propiedad del objeto
  notas: /** @type {Nota[]} */ ([]), //([]) es un array vacío de objetos de tipo Nota
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
     // Convertimos el objeto a texto JSON y lo guardamos en localStorage
     //localStorage es un almacenamiento interno del navegador que guarda pares clave-valor
     //JSON.stringify(datos) convierte el objeto datos en una cadena JSON para poder guardarlo
     //"tablon_estado" es la clave con la que se guarda.
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
    //Usa el método getItem() de localStorage para leer los datos guardados bajo la clave "tablon_estado"
    const raw = localStorage.getItem("tablon_estado");
    //Si no hay nada guardado (es null o vacío), sale de la función sin hacer nada.
    //si es la primera vez que se abre la app, no intenta cargar nada.
    if (!raw) return;
    //Convierte el texto JSON (raw) a un objeto JavaScript real.
    const datos = JSON.parse(raw);
    //Comprueba que datos.notas sea realmente un array.
    //Si lo es, lo copia dentro del estado de la app:estado.notas = datos.notas
    //Así tus notas vuelven a aparecer tras recargar la página.
    if (Array.isArray(datos.notas)) estado.notas = datos.notas;
    //Comprueba que filtro sea una cadena de texto.Si lo es, también lo restaura al estado actual.
    if (typeof datos.filtro === "string") estado.filtro = datos.filtro;
  } catch (err) {
    //Si el texto está dañado o no es un JSON válido, se producirá un error, 
    // que será atrapado por el catch
    console.warn("Datos corruptos en localStorage. Se reinicia el estado.", err);
    //borra los datos corruptos
    localStorage.removeItem("tablon_estado");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //
  cargarEstado();
  document.querySelectorAll("nav [data-hash]").forEach(btn => {
    btn.addEventListener("click", () => { location.hash = btn.getAttribute("data-hash"); });
  });
  //submit se dispara cuando se envía un formulario
  document.getElementById("formNota").addEventListener("submit", onSubmitNota);
  //El evento click se dispara cuando el usuario hace clic con el mouse
  document.getElementById("btnPanelDiario").addEventListener("click", abrirPanelDiario);
  document.getElementById("btnPantallaCompleta").addEventListener("click", togglePantallaCompleta);
  //Botones importar/ exportar:
  document.getElementById("btnExportar").addEventListener("click", exportarNotas);
  const inputImportar = document.getElementById("inputImportar");
  //getElementById → localiza el botón en el HTML mediante su id "btnImportar".
  //addEventListener("click", ...) → detecta cuándo lo clicas.
//inputImportar.click() → simula un clic en el input de archivos. 
  document.getElementById("btnImportar").addEventListener("click", () => inputImportar.click());
  document.getElementById()
  
  
  
  //e (de event) representa el evento en sí, y contiene toda la información sobre lo que pasó 
  // (qué elemento cambió, qué archivo se seleccionó, etc.).
  inputImportar.addEventListener("change", (e) => {
    //e.target es el elemento que disparó el evento (es decir, el input).
    //.files es una lista (array-like) con los archivos seleccionados.
    //se guarda en la variable archivo
  const archivo = e.target.files[0];
  //Comprueba que realmente se haya seleccionado un archivo
  if (archivo) {
    importarNotas(archivo);
    //Limpia el valor del input. Así puedes importar el mismo archivo otra vez si quieres.
    e.target.value = "";
  }
});
  render();
});
//El hash es la parte de una URL que va después del símbolo #.
//"hashchange" es un evento especial que se dispara cada vez que cambia el hash en la URL.
window.addEventListener("hashchange", () => {
  //Llama a la función que lee el valor del hash y actualiza el filtro de la aplicacion
  estado.filtro = obtenerFiltroDesdeHash();
  render();//Vuelve a dibujar (renderizar) la interfaz de la app con el nuevo filtro.
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
  //asegura que p sea un número entre 1 y 3
  //Number(prioridad) , Convierte la variable prioridad a un número
  //Si Number(prioridad) es un número válido → usa ese número.
 //Si no lo es (NaN, undefined, etc.) → usa 1 como valor por defecto.
 //Compara el número con 3 y devuelve el menor de los dos.
  const p = Math.max(1, Math.min(3, Number(prioridad) || 1));
  const f = new Date(fecha);
  if (!t || Number.isNaN(f.getTime())) throw new Error("Datos de nota inválidos");
  return { id: "n" + Math.random().toString(36).slice(2), texto: t, fecha: f.toISOString().slice(0,10), prioridad: p };
}

/**
 * Obtiene el filtro activo a partir del hash de la URL.
 * @returns {string} Hash correspondiente al filtro actual.
 */
//location es un objeto del navegador que representa la URL actual.
//“Si location.hash tiene algo, úsalo; si no, usa "#todas" como valor por defecto.”
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
  const hoy = new Date(); 
  //Convierte la fecha actual a formato ISO: "2025-11-12T18:30:00.000Z".
  //Luego toma solo los primeros 10 caracteres
  const ymd = hoy.toISOString().slice(0,10);
  //recorre todas las notas y devuelve solo las que tengan la misma fecha que hoy.
  if (estado.filtro === "#hoy") return notas.filter(n => n.fecha === ymd);
  if (estado.filtro === "#semana") {
    const fin = new Date(hoy); 
    fin.setDate(hoy.getDate() + 7);
    //Convierte n.fecha a objeto Date y se queda solo con las notas cuya fecha esté entre hoy y dentro de una semana.
    return notas.filter(n => new Date(n.fecha) >= hoy && new Date(n.fecha) <= fin);
  }
  return notas;//Si el filtro no es #hoy ni #semana, devuelve todas las notas sin filtrar.
}

/**
 * Ordena las notas por prioridad, fecha y texto.
 * @param {Nota[]} notas - Array de notas a ordenar.
 * @returns {Nota[]} Notas ordenadas.
 */
function ordenarNotas(notas) {
  //[...notas] crea una copia del array original, para no modificarlo directamente
  return [...notas].sort((a,b) => //Ordena por prioridad (descendente)
    b.prioridad - a.prioridad || //Si empatan en prioridad, ordena por fecha
    new Date(a.fecha) - new Date(b.fecha) || //Si empatan en fecha, ordena por texto
    a.texto.localeCompare(b.texto) //localeCompare(), compara los textos alfabéticamente
  );
}

/**
 * Renderiza las notas visibles en el contenedor principal.
 * actualiza la interfaz para mostrar las notas que están guardadas.
 * “pinta” en pantalla todas las notas visibles, ordenadas y filtradas,
 * @returns {void}
 */
function render() {
  //Selecciona el contenedor donde se mostrarán las notas
  const cont = document.getElementById("listaNotas");
  cont.innerHTML = ""; //Limpia el contenedor para evitar duplicados
  //Obtiene las notas filtradas y ordenadas
  //estado.notas →  array global con todas las notas guardadas.
  //filtrarNotas(...) → devuelve solo las que coinciden con el filtro actual
  //ordenarNotas(...) → las ordena según prioridad, fecha y texto
  const visibles = ordenarNotas(filtrarNotas(estado.notas));
  //Recorre todas las notas visibles (n representa cada nota individual).
  for (const n of visibles) {
    //Crea un elemento article para cada nota
    const card = document.createElement("article");
    card.className = "nota"; //Le da la clase "nota" para aplicar estilos CSS.
   //Rellena el contenido HTML del artículo con la información de la nota
    //${escapeHtml(n.texto)} → protege el texto por seguridad (evita inyecciones de HTML).
    //[P${n.prioridad}] → muestra la prioridad.
    //<time> → muestra la fecha formateada.
    //Botones "Completar","Borrar" u "Editar" con atributos data para identificar la acción y la nota.
   card.innerHTML = `
      <header>
        <strong>[P${n.prioridad}] ${escapeHtml(n.texto)}</strong>
        <time datetime="${n.fecha}">${formatearFecha(n.fecha)}</time>
      </header>
      <footer>
        <button data-acc="completar" data-id="${n.id}">Completar</button>
        <button data-acc="editar" data-id="${n.id}">Editar</button>
        <button data-acc="borrar" data-id="${n.id}">Borrar</button>
      </footer>
    `;
  
    cont.appendChild(card);//Añade el artículo al contenedor principal

  }
  //Busca todos los botones dentro del contenedor que tengan el atributo data-acc (o sea, los de “Completar”, “Borrar” y "Editar").
  //cada botón encontrado le añade un evento "click".
  //Cuando se haga clic, se ejecutará la función onAccionNota
  //Dentro de la función se comprueba qué botón se pulsó y se realiza la acción correspondiente (borrar o completar la nota).
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
  e.preventDefault();//evita que la app se reinicie al hacer “submit”.
  const texto = document.getElementById("txtTexto").value; //obtiene el valor del campo de texto
  const fecha = document.getElementById("txtFecha").value;
  const prioridad = document.getElementById("selPrioridad").value;
  try {
    const nota = crearNota(texto, fecha, prioridad);
    estado.notas.push(nota);//añade la nueva nota al array de notas
    guardarEstado();//guarda el estado actualizado en localStorage
    e.target.reset();//limpia el formulario para que puedas añadir otra nota
    alert("Nota creada");
    render();
  } catch (err) { alert(err.message); }//si hay error, lo muestra en un alert
}

/**Valida que el nuevo texto cumpla los requisitos.
 * 
 * @param {*} nuevoTexto nuevo texto
 */

function validarTexto(nuevoTexto) {
//Crea un elemento input para editar el texto de la nota
const inputTexto = document.createElement("input");
inputTexto.value = nota.texto; //Establece el valor inicial del input con el texto actual de la nota
inputTexto.required = true; //Hace que el campo sea obligatorio y no se pueda dejar vacío
inputTexto.maxLength = 200; //Limita la longitud máxima del texto a 200 caracteres
inputTexto.setCustomValidity("");//Limpia cualquier mensaje de validación previo

//Valida el campo de texto , si no es válido, muestra un mensaje de error
if(!inputTexto.checkValidity()) {
  inputTexto.setCustomValidity("El texto es obligatorio y debe tener menos de 200 caracteres.");
  inputTexto.reportValidity(); //Muestra el mensaje de validación al usuario
  return; //Sale de la función si el texto no es válido
}
}

/**
 * Valida que la nueva fecha cumpla los requisitos.
 * @param {*} nuevaFecha nueva fecha
 * @returns 
 */


function validarFecha(nuevaFecha) {
//Validación de la fecha
const inputFecha = document.createElement("input");
inputFecha.value = nota.fecha; //Establece el valor inicial del input con la fecha actual de la nota
inputFecha.type = "date"; //Establece el tipo de input como fecha
inputFecha.min = new Date(); //Fecha mínima permitida
inputFecha.setCustomValidity("");//Limpia cualquier mensaje de validación previo


//Valida el campo de fecha , si no es válido, muestra un mensaje de error
if(!inputFecha.checkValidity()) {
  inputFecha.setCustomValidity("La fecha no puede ser anterior a hoy.");
  inputFecha.reportValidity(); //Muestra el mensaje de validación al usuario
  return; //Sale de la función si la fecha no es válida

}
}



function validarPrioridad(nuevaPrioridad){
//Validación de la prioridadconst inputPrioridad = document.createElement("input");
inputPrioridad.value = nota.prioridad; //Establece el valor inicial del input con la prioridad actual de la nota
inputPrioridad.type = "number"; //Establece el tipo de input como número
inputPrioridad = Math.max(1, Math.min(3, Number(prioridad) || 1)); //Limita el valor entre 1 y 3
inputPrioridad.setCustomValidity("");//Limpia cualquier mensaje de validación previo

//Valida el campo de prioridad , si no es válido, muestra un mensaje de error
if(!inputPrioridad.checkValidity()) {
  inputPrioridad.setCustomValidity("La prioridad debe estar entre 1 y 3.");
  inputPrioridad.reportValidity(); //Muestra el mensaje de validación al usuario
  return; //Sale de la función si la prioridad no es válida 


}
}

/**
 * 
 * Función para editar una nota
 * @param {*} nuevoTexto 
 * @param {*} nuevaFecha 
 * @param {*} nuevaPrioridad 
 */


function editarNota(id,nuevoTexto, nuevaFecha, nuevaPrioridad) {
//Validar que solo se puede editar una nota a la vez
  
if(validarTexto(nuevoTexto)) {
  nota.texto = nuevoTexto; //Actualiza el texto de la nota
}

if(validarFecha(nuevaFecha)) {
  nota.fecha = nuevaFecha; //Actualiza la fecha de la nota
}

if(validarPrioridad(nuevaPrioridad)) {
  nota.prioridad = nuevaPrioridad; //Actualiza la prioridad de la nota
}

 alert("Nota editada correctamente");


//Botones de "Guardar" y "Cancelar"
const btnGuardar = document.createElement("button"); 
btnGuardar.textContent = "Guardar"; 
const btnCancelar = document.createElement("button");
btnCancelar.textContent = "Cancelar";

}












/**
 * Gestiona las acciones sobre las notas (borrar o completar).
 * @param {MouseEvent} e - Evento del botón pulsado.
 * @returns {void}
 */

/**
 * splice var removed = myFish.splice(2, 0, "drum");
 * Eliminar 0 elementos desde el índice 2 e insertar "drum"
 * 
 * var myFish = ["angel", "clown", "mandarin", "sturgeon"];
  var removed = myFish.splice(2, 0, "drum");
  myFish is ["angel", "clown", "drum", "mandarin", "sturgeon"]
 */


function onAccionNota(e) {
  const btn = e.currentTarget;//el botón que se ha pulsado
  const id = btn.getAttribute("data-id"); //extrae data-id, para saber a qué nota nos estamos refiriendo.
  const acc = btn.getAttribute("data-acc");
  //busca el índice de la nota en el array estado.notas según su id.
  const idx = estado.notas.findIndex(n => n.id === id);
  //Validamos que la nota exista
  if (idx < 0) return; //si no la encuentra, sale de la función sin hacer nada
  if (acc === "borrar"){ //si la acción es borrar
    if(confirm("¿Borrar la nota?")) { //pide confirmación
        estado.notas.splice(idx, 1); //splice borra el elemento del array en esa posición
    }
  }else if(acc === "completar"){
    estado.notas[idx].completada = true; //marca la nota como completada
    alert("Nota completada");
  
  }else if(acc === "editar"){
    //Obtener la referencia de la nota a editar en estado.notas
   estado.notas[idx];
   //Llamar a la función editarNota con los datos actuales de la nota
      editarNota(estado.notas[idx].id, estado.notas[idx].texto, estado.notas[idx].fecha, estado.notas[idx].prioridad);
     
  }
  

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
    //window.open(url, nombre interno de la ventana, características)
  const ref = window.open("panel.html", "PanelDiario", "width=420,height=560");
  // Si el navegador ha bloqueado el popup, window.open devuelve null o undefined
  if (!ref) { alert("Pop-up bloqueado. Permita ventanas emergentes."); return; } // avisa al usuario y salimos de la función
    
  //Envia los datos al panel (snapshot de notas filtradas)
  //crea un objeto con los datos que se van a enviar al panel:
  // tipo: "SNAPSHOT" para identificar el mensaje
  // notas: filtrarNotas(estado.notas) → toma las notas actuales (del estado principal) y las filtra
  const snapshot = { tipo: "SNAPSHOT", notas: filtrarNotas(estado.notas) };
  //setTimeout: espera un poco a que la ventana cargue antes de enviar
// enviamos el objeto snapshot SOLO al mismo origen
   // si algo falla, 
  setTimeout(() => {
     try { 
      //ref.postMessage(...) se usa para enviar datos a otra ventana
      //primer parámetro es el mensaje
      //location.origin, lo que significa que solo se enviará si la otra ventana pertenece al mismo dominio
      ref.postMessage(snapshot, location.origin); 
     } catch (err){
    console.error("Error enviando snapshot:", err);
  } }, 400); // espera 400 ms ara cargar completamente su script, Si se enviara el mensaje justo al abrir, probablemente todavía no podría recibirlo.
}

//Escucha los mensajes desde el panel
window.addEventListener("message", (ev) => { //ev contiene información sobre el mensaje.
   //Validar origen
   if (ev.origin !== location.origin) return; // ignora mensajes de otros sitios
   
   // Validar que el contenido del mensaje exista y sea un objeto
   if (!ev.data || typeof ev.data !== "object") return;

// Guardamos el contenido del mensaje en la variable "mensaje" para trabajar con él
   const mensaje = ev.data;
   if(!mensaje.tipo) return; // si el objeto no tiene 'tipo', lo ignoramos (no es un mensaje válido)

   // Si el tipo es SNAPSHOT y notas es un array
  if(mensaje.tipo === "SNAPSHOT" && Array.isArray(mensaje.notas)) {
     estado.notas = mensaje.notas; // actualizamos el estado con las notas del panel //CAMBIADO PASAR A ALBA
    render();//renderizamos esas notas en la app principal
  }


  // Si el tipo es BORRADO, intentamos borrar la nota con el id recibido
  if (mensaje.tipo === "BORRADO") {
    const id = mensaje.id;
    if(id=== undefined) return; // si no hay id, no hacemos nada
    // Filtramos las notas para quitar la que tenga el id recibido
    //filter() crea un nuevo array que contiene todas las notas cuyo id sea distinto al que recibimos.
    //En otras palabras, elimina del array la nota que coincide con el id recibido.
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
  //document.fullscreenElement devuelve el elemento que actualmente está en pantalla completa.
  if (document.fullscreenElement) { //i hay alguno → significa que estamos en pantalla completa.
    document.exitFullscreen();//salir de pantalla completa
    console.log("Pantalla completa desactivada");
  } else { //Si no hay ninguno → no estamos en pantalla completa.
    document.documentElement.requestFullscreen();//entrar en pantalla completa
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
    //Blob es el estándar para manejar datos “como archivos” en JavaScript.
    //new Blob([…]) → crea un archivo binario en memoria con ese JSON, listo para descargar.
    //JSON.stringify(datos) → convierte el objeto datos a cadena JSON.
    const binario = new Blob([JSON.stringify(datos)]); 
    //Crear objeto binario: (https://developer.mozilla.org/en-US/docs/Web/API/Blob).
    //genera una URL temporal para ese archivo en memoria, que apunta al archivo binario que acabamos de crear.
    //Esa URL se puede usar como href en un enlace <a> para forzar la descarga.
    const url = URL.createObjectURL(binario);
    const a = document.createElement("a");
    a.href = url; //asignar la URL al enlace
    a.download = "tablon_notas.json"; //nombre del archivo que se descargará
    //forzar descarga, simula que el usuario hizo clic, iniciando la descarga automáticamente.
    a.click();
    URL.revokeObjectURL(url);//liberar memoria borrando la URL temporal
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
  //FileReader es una API de JavaScript para leer archivos locales seleccionados por el usuario.
  //os permite leerlos como texto, como datos binarios o como URL de datos.
  const leer = new FileReader(); 
  //Esta función se ejecuta cuando el archivo se ha leído completamente.
  leer.onload = (e) => {
    try{
      //convertir a objeto
      //e.target.result contiene el contenido del archivo
      const datos = JSON.parse(e.target.result);
      //verificar su formato:
      if(!Array.isArray(datos.notas))throw new Error ("El formato escogido es inválido.");
      estado.notas=datos.notas;//Sobrescribe estado.notas con el contenido del archivo.
      if(typeof datos.filtro === "string"){
        estado.filtro = datos.filtro; //También actualiza el filtro si existe y es una cadena válida.
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
  //Indica al FileReader que lea el archivo como texto plano.
  //Una vez leído, se dispara onload para procesarlo.
  leer.readAsText(archivo);
}


