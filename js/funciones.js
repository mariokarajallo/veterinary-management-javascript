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
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

//
let editando;
export let DB;

//

//

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

    //pasar el objeto de la cita a edicion
    // no pasamos el objeto global completo, si no una copia
    administrarCitas.editarCita({ ...citaObj });

    //edita en indexeDB
    const transaction = DB.transaction(["citas"], "readwrite");
    const objectStore = transaction.objectStore("citas");

    objectStore.put(citaObj);

    transaction.oncomplete = () => {
      //mensaje de editado correctamente
      ui.imprimirAlerta("Editado Correctamente");

      //cambiamos el texto del boton
      formulario.querySelector('button[type="submit"]').value = "Crear Cita";

      //quitar modo edicion
      editando = false;
    };

    transaction.onerror = () => {
      console.log("Hubo un error!");
    };
  } else {
    //nuevo registro
    // si es una nueva cita asiganamos un ID y tambien agregamos al arreglo de citas
    console.log("modo nueva cita");

    // generar un ID
    citaObj.id = Date.now();

    //creando una nueva cita, le pasamos una copia del objeto ->spreadoperator
    administrarCitas.agregarCita({ ...citaObj });

    // insertar registros del formulario en la base de datos indexedb
    const transaction = DB.transaction(["citas"], "readwrite");

    //habilitar el objectstore
    const objectStore = transaction.objectStore("citas");

    // insertar en la base de datos
    objectStore.add(citaObj);

    // si todo salio bien
    transaction.oncomplete = function () {
      console.log("cita agregada correctamente");

      //mensaje de agregado correctamente
      ui.imprimirAlerta("Se agrego Correctamente");
    };

    transaction.onerror = () => {
      console.log("Hubo un error!");
    };
  }

  //reiniciar el objeto para la validacion
  reiniciarCitaObj();

  //limpia formulario luego de agregar una nueva cita
  formulario.reset();

  //mostar el HTML de las citas
  ui.imprimirCitas();
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
  const transaction = DB.transaction(["citas"], "readwrite");
  const objectStore = transaction.objectStore("citas");

  objectStore.delete(id);

  transaction.oncomplete = () => {
    console.log(`cita ${id} eliminada...`);

    //muestra el mensaje de que se elimino correctamente, no es necesario mandar el tipo
    ui.imprimirAlerta("La cita se elimino correctamente");

    //Refresca/actualiza las citas que se muestran en el HTML
    ui.imprimirCitas();
  };

  transaction.onerror = () => {
    console.log("hubo un error");
  };
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

export function crearDB() {
  //crear la base de datos en version 1.0
  const crearDB = window.indexedDB.open("citas", 1);

  //si hay un error
  crearDB.onerror = function () {
    console.log("hubo un error");
  };

  //si no hay problemas
  crearDB.onsuccess = function () {
    console.log("DB creada");

    DB = crearDB.result;

    // mostrar citas al cargar (pero indexedb ya esta listo)
    ui.imprimirCitas();
  };

  // define el squema
  crearDB.onupgradeneeded = function (e) {
    const db = e.target.result;

    const objectStore = db.createObjectStore("citas", {
      keyPath: "id",
      autoIncrement: true,
    });

    // define las columnas
    objectStore.createIndex("mascota", "mascota", { unique: false });
    objectStore.createIndex("propietario", "propietario", { unique: false });
    objectStore.createIndex("telefono", "telefono", { unique: false });
    objectStore.createIndex("fecha", "fecha", { unique: false });
    objectStore.createIndex("hora", "hora", { unique: false });
    objectStore.createIndex("sintomas", "sintomas", { unique: false });
    objectStore.createIndex("id", "id", { unique: true });

    console.log("DB creado y listo");
  };
}
