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
class Citas {}

class UI {}

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
}

//!FUNCIONES
//? Agrega datos al objeto principal CITA
function datosCita(e) {
  // se va asiganando la propiedad del objeto "citaObj" segun llave "name",y valor que el usuario va escribiendo
  citaObj[e.target.name] = e.target.value;
  console.log(citaObj);
}
