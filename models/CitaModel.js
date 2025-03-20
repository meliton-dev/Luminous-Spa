// Estructura de una cita en Firestore
const citaEstructura = {
  id: 'auto-generado',
  clienteId: 'ID_USUARIO',
  servicioId: 'ID_SERVICIO',
  terapeutaId: 'ID_TERAPEUTA',
  fecha: 'TIMESTAMP',
  hora: '10:00',
  duracion: 60, // en minutos
  estado: 'pendiente', // pendiente, confirmada, cancelada, completada
  precio: 600,
  notas: 'Notas adicionales',
  createdAt: 'TIMESTAMP',
  updatedAt: 'TIMESTAMP'
}