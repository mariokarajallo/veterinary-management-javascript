//!VARIABLES
//?campos del formulario
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

//?UI : interfaz del usuario
const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");

// objeto donde se guardaran los datos del paciente/CITA
const citaObj = {
  mascotas: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

//!CLASES
class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita];
    console.log(this.citas);
  }
}

class UI {
  imprimirAlerta(mensaje, tipo) {
    //crear el elemento DIV para contener el mensaje dentro
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    // agregar clase para el estilo en base al tipo de error
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    //asignando el mensaje de error
    divMensaje.textContent = mensaje;

    //agregar el mensaje al DOM
    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

    //quitar la alerta despues de 5 segundos
    setTimeout(() => {
      divMensaje.remove();
    }, 5000);
  }

  //hacemos destructuring desde el parametro del metodo, de esta manera accedemos de forma directa al arreglo de citas
  imprimirCitas({ citas }) {
    this.limpiarHTML();
    //recorremos el objeto con forEach
    citas.forEach((cita) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        cita;

      //cada cita estara dentro de un div con su respectivo ID
      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      //scripting de los elementos de la cita
      //Mascota
      const mascotaParrafo = document.createElement("h2");
      mascotaParrafo.classList.add("card-title", "font-weight-bolder");
      mascotaParrafo.textContent = mascota;

      //propietario
      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;

      //telefono
      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span> ${telefono}
      `;

      //fecha
      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span> ${fecha}
      `;

      //hora
      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span> ${hora}
      `;

      //sintomas
      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
      `;

      //boton para eliminar esta cita
      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn", "btn-danger", "mr-2");
      btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`;
      btnEliminar.onclick = () => eliminarCita(id);

      //agregar los parrafos al DIV
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);

      //agregar las citas al HTML
      contenedorCitas.appendChild(divCita);
    });
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

//instanciamos las clases de manera global
const ui = new UI();
const administrarCitas = new Citas();

//!EVENTILISTENER
eventListeners();
function eventListeners() {
  //escuchamos lo que el usuario tipea en los campos "inputs" del formulario
  mascotaInput.addEventListener("input", datosCita);
  propietarioInput.addEventListener("input", datosCita);
  telefonoInput.addEventListener("input", datosCita);
  fechaInput.addEventListener("input", datosCita);
  horaInput.addEventListener("input", datosCita);
  sintomasInput.addEventListener("input", datosCita);

  formulario.addEventListener("submit", nuevaCita);
}

//!FUNCIONES
//? Agrega datos al objeto principal CITA
function datosCita(e) {
  // se va asiganando la propiedad del objeto "citaObj" segun llave "name",y valor que el usuario va escribiendo
  citaObj[e.target.name] = e.target.value;
  // console.log(citaObj);
}

//? valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
  e.preventDefault();

  // extraer la informacion del objeto principal cita
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  //validar que los campos no esten vacios
  if (
    mascota === "" ||
    propietario === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    ui.imprimirAlerta("Todos los campos son obligatorios", "error");
    return; // si algun campo esta vacio entonces evitamos que se siga ejecutando las siguientes lineas
  }
  // generar un ID
  citaObj.id = Date.now();

  //creando una nueva cita, le pasamos una copia del objeto ->spreadoperator
  administrarCitas.agregarCita({ ...citaObj });

  //reiniciar el objeto para la validacion
  reiniciarCitaObj();

  //limpia formulario luego de agregar una nueva cita
  formulario.reset();

  //mostar el HTML de las citas
  ui.imprimirCitas(administrarCitas);
}

//? limpia el objeto principal para volver a guardar nuevos datos
function reiniciarCitaObj() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
}
