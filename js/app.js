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
