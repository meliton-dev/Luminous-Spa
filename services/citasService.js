import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../database/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { programarNotificacionCita } from './servicesCuenta';

export const crearCita = async (citaData) => {
  try {
    // Verificar si ya existe una cita en la misma fecha y hora
    const citasRef = collection(db, 'citas');
    const q = query(
      citasRef,
      where('fecha', '==', citaData.fecha),
      where('hora', '==', citaData.hora)
    );
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error('Ya existe una cita en este horario');
    }

    // Si no existe, crear la nueva cita
    const docRef = await addDoc(collection(db, 'citas'), {
      ...citaData,
      createdAt: new Date()
    });

    // Programar notificaciones para la cita
    await programarNotificacionCita({
      ...citaData,
      id: docRef.id
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error al crear la cita:', error);
    throw new Error('No se pudo crear la cita');
  }
};

export const obtenerCitasUsuario = async (userId) => {
  try {
    const citasRef = collection(db, 'citas');
    const q = query(citasRef, where('clienteId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return [];
  }
};

export const actualizarEstadoCita = async (citaId, nuevoEstado) => {
  try {
    const citaRef = doc(db, 'citas', citaId);
    await updateDoc(citaRef, {
      estado: nuevoEstado
    });
    return true;
  } catch (error) {
    console.error('Error al actualizar estado de la cita:', error);
    throw error;
  }
};