import { eliminarCita, cargarEdicion, DB } from "../funciones.js";
import { contenedorCitas, heading } from "../selectores.js";

export default class UI {
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
  imprimirCitas() {
    this.limpiarHTML();

    this.textoHeading();

    //leer el contenido de la base de datos
    const objectStore = DB.transaction("citas").objectStore("citas");

    const fnTextoHeading = this.textoHeading;
    const total = objectStore.count();
    total.onsuccess = function () {
      // console.log(total.result);
      fnTextoHeading(total.result);
    };

    //openCursos se encargar de rerrocer/iterar todos los elementos de la base de datos
    objectStore.openCursor().onsuccess = function (e) {
      const cursor = e.target.result;

      if (cursor) {
        // destructuramos los elementos de nuestro base de datos para extraelos
        const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
          cursor.value;
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

        // agregar un boton para editar
        const btnEditar = document.createElement("button");
        btnEditar.classList.add("btn", "btn-info");
        btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
</svg>
`;
        //accion al darle click, pasamos el objeto completo de cita
        const cita = cursor.value;
        btnEditar.onclick = () => cargarEdicion(cita);

        //agregar los parrafos al DIV
        divCita.appendChild(mascotaParrafo);
        divCita.appendChild(propietarioParrafo);
        divCita.appendChild(telefonoParrafo);
        divCita.appendChild(fechaParrafo);
        divCita.appendChild(horaParrafo);
        divCita.appendChild(sintomasParrafo);
        divCita.appendChild(btnEliminar);
        divCita.appendChild(btnEditar);

        //agregar las citas al HTML
        contenedorCitas.appendChild(divCita);

        // iterador vaya al siguiente elemento
        cursor.continue();
      }
    };
  }

  textoHeading(resultado) {
    if (resultado > 0) {
      heading.textContent = "Administra tus Citas";
    } else {
      heading.textContent = "No hay citas, comienza creando una cita";
    }
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}
