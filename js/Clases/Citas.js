export default class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita];
    console.log(this.citas);
  }

  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
  }

  editarCita(citaActualizada) {
    //.map no .filter -> filter quita un elemento, o quita los demas elementos y mantiene uno basado en una condicion
    // .map a diferencia de forEach, nos crea un nuevo arreglo, ambos iteran sobre el arreglo
    // iteramos el array de citas, verificamos que tengan el mismo ID, si es asi se reescribe todo el objeto que recibimos, si no mantemos nuestros elementos de la cita actual
    this.citas = this.citas.map((cita) =>
      cita.id == citaActualizada.id ? citaActualizada : cita
    );
  }
}
