//FUNCIÓN PARA OBTENER Y FORMATEAR LA FECHA
function obtenerFechaDeHoy() {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
    return fechaFormateada;
}

const fecha = document.querySelector('#fecha');
fecha.innerHTML = obtenerFechaDeHoy();

//VARIABLES PARA ELEMENTOS HTML Y ESTADOS
const input = document.querySelector('#input');
const botonEnviar = document.querySelector('#botonEnviar');
const lista = document.querySelector('#lista');

const check = 'fa-check-circle';
const uncheck = 'fa-circle';
const lineThrough = 'line-through';

let id = 0;
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

//FUNCION PARA GUARDAR TAREAS EN LOCALSTORAGE
function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

//AGREGAR TAREA
function agregarTarea(tarea, id, realizado, eliminado) {
    if (eliminado) {
        return;
    }

    const REALIZADO = realizado ? check : uncheck;
    const LINE = realizado ? lineThrough : '';

    const elemento = `<li id="elemento">
                        <i class="far ${REALIZADO}" data="hecho" id="${id}"></i>
                        <p class="text ${LINE}">${tarea}</p>
                        <i class="fas fa-trash de" data="eliminado" id="${id}"></i>
                      </li>`;

    lista.insertAdjacentHTML("beforeend", elemento);
}

//TAREA REALIZADA
function tareaRealizada(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(lineThrough);

    tareas[element.id].realizado = !tareas[element.id].realizado;
    guardarTareas();
}

//TAREA ELIMINADA
function tareaEliminada(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    tareas[element.id].eliminado = true;
    guardarTareas();
}

// EVENTO CLIC PARA AGREGAR TAREA
botonEnviar.addEventListener('click', () => {
    const nombreTarea = input.value.trim();
    if (nombreTarea) {
        tareas.push({
            nombre: nombreTarea,
            id: id,
            realizado: false,
            eliminado: false
        });
        guardarTareas();
        agregarTarea(nombreTarea, id, false, false);
        id++;
    }
    input.value = '';
});

// EVENTO PARA AGREGAR TAREA AL PRESIONAR ENTER
document.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        const nombreTarea = input.value.trim();
        if (nombreTarea) {
            tareas.push({
                nombre: nombreTarea,
                id: id,
                realizado: false,
                eliminado: false
            });
            guardarTareas();
            agregarTarea(nombreTarea, id, false, false);
            id++;
        }
        input.value = '';
    }
});

// EVENTO CLIC PARA LA LISTA DE TAREAS
lista.addEventListener('click', function (event) {
    const element = event.target;
    const elementData = element.attributes.data.value;

    if (elementData === 'hecho') {
        tareaRealizada(element);
    } else if (elementData === 'eliminado') {
        tareaEliminada(element);
    }
});

// CARGAR TAREAS DESDE LOCALSTORAGE AL INICIAR
tareas.forEach(tarea => {
    agregarTarea(tarea.nombre, tarea.id, tarea.realizado, tarea.eliminado);
    id = tarea.id + 1;
});
