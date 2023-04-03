import { datosCita, nuevaCita, crearDB } from "../funciones.js";
import {
  mascotaInput,
  propietarioInput,
  telefonoInput,
  fechaInput,
  horaInput,
  sintomasInput,
  formulario,
} from "../selectores.js";

export default class App {
  constructor() {
    // llamamos al metodo que inicia la app
    this.initApp();
  }

  initApp() {
    //escuchamos lo que el usuario tipea en los campos "inputs" del formulario
    mascotaInput.addEventListener("input", datosCita);
    propietarioInput.addEventListener("input", datosCita);
    telefonoInput.addEventListener("input", datosCita);
    fechaInput.addEventListener("input", datosCita);
    horaInput.addEventListener("input", datosCita);
    sintomasInput.addEventListener("input", datosCita);

    formulario.addEventListener("submit", nuevaCita);

    crearDB();
  }
}
