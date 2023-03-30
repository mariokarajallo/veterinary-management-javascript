import Citas from "./Clases/Citas.js";
import UI from "./Clases/UI.js";

import {
  mascotaInput,
  propietarioInput,
  telefonoInput,
  fechaInput,
  horaInput,
  sintomasInput,
  formulario,
} from "./selectores.js";

// objeto donde se guardaran los datos del paciente/CITA
const citaObj = {
  mascotas: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

//
let editando;

//instanciamos las clases de manera global
const ui = new UI();
const administrarCitas = new Citas();

//!FUNCIONES
//? Agrega datos al objeto principal CITA
export function datosCita(e) {
  // se va asiganando la propiedad del objeto "citaObj" segun llave "name",y valor que el usuario va escribiendo
  citaObj[e.target.name] = e.target.value;
  // console.log(citaObj);
}

//? valida y agrega una nueva cita a la clase de citas
export function nuevaCita(e) {
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

  // preguntamos si el usuario esta editando -> modo edicion
  if (editando) {
    console.log("modo edicion");
    //mensaje de editado correctamente
    ui.imprimirAlerta("Editado Correctamente");

    //pasar el objeto de la cita a edicion
    // no pasamos el objeto global completo, si no una copia
    administrarCitas.editarCita({ ...citaObj });

    //cambiamos el texto del boton
    formulario.querySelector('button[type="submit"]').textContent =
      "Crear Cita";

    //quitar modo edicion
    editando = false;
  } else {
    // si es una nueva cita asiganamos un ID y tambien agregamos al arreglo de citas
    console.log("modo nueva cita");

    // generar un ID
    citaObj.id = Date.now();

    //creando una nueva cita, le pasamos una copia del objeto ->spreadoperator
    administrarCitas.agregarCita({ ...citaObj });

    //mensaje de agregado correctamente
    ui.imprimirAlerta("Se agrego Correctamente");
  }

  //reiniciar el objeto para la validacion
  reiniciarCitaObj();

  //limpia formulario luego de agregar una nueva cita
  formulario.reset();

  //mostar el HTML de las citas
  ui.imprimirCitas(administrarCitas);
}

//? limpia el objeto principal para volver a guardar nuevos datos
export function reiniciarCitaObj() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
}

//? elimina la cita agregada por el usuario
export function eliminarCita(id) {
  //elimina la cita
  administrarCitas.eliminarCita(id);

  //muestra el mensaje de que se elimino correctamente, no es necesario mandar el tipo
  ui.imprimirAlerta("La cita se elimino correctamente");

  //Refresca/actualiza las citas que se muestran en el HTML
  // le pasamos todo el objeto por que en el metodo de la clase desde el parametro aplica el destructuring
  ui.imprimirCitas(administrarCitas);
}

//? carga los datos y el modo de edicion
export function cargarEdicion(cita) {
  //extraemos los elementos de la cita que estamos recibiendo -> destructuring
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  //llenamos los inputs del formulario con los datos del objeto recibido
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // llenar el objeto con los campos actuales
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  //cambiar el texto del boton a "Guardar cambios"
  formulario.querySelector('button[type="submit"]').textContent =
    "Guardar Cambios";

  // una vez entrando a la funcion cargarEdicion la variable editando pasa a true
  editando = true;
}
