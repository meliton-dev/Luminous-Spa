import { collection, addDoc } from 'firebase/firestore';
import { db } from '../database/firebase';

const serviciosIniciales = [
  {
    nombre: 'Masaje Relajante',
    descripcion: 'Libera el estrés y la tensión',
    duracion: 60,
    precio: 600,
    imagen: 'URL_IMAGEN',
    disponible: true,
    categoria: 'masajes'
  },
  {
    nombre: 'Exfoliación Corporal',
    descripcion: 'Renueva tu piel',
    duracion: 45,
    precio: 500,
    imagen: 'URL_IMAGEN',
    disponible: true,
    categoria: 'tratamientos'
  }
];

const terapeutasIniciales = [
  {
    nombre: 'Ana López',
    especialidad: ['masajes', 'tratamientos'],
    disponible: true,
    horario: {
      lunes: ['9:00', '10:00', '11:00', '12:00', '16:00', '17:00'],
      martes: ['9:00', '10:00', '11:00', '12:00', '16:00', '17:00'],
      // ... otros días
    }
  }
];