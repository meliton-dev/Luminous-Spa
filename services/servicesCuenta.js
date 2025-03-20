import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../database/firebase';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const actualizarPreferenciasNotificaciones = async (userId, preferencias) => {
  try {
    // Primero obtener el documento del usuario
    const userRef = collection(db, 'usuarios');
    const q = query(userRef, where('uid', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Usuario no encontrado');
    }

    // Obtener el ID del documento
    const docId = querySnapshot.docs[0].id;
    const userDocRef = doc(db, 'usuarios', docId);

    // Actualizar las preferencias
    await updateDoc(userDocRef, {
      notificaciones: preferencias
    });
    
    return true;
  } catch (error) {
    console.error('Error al actualizar preferencias:', error);
    throw error;
  }
};

export const configurarNotificaciones = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Recordatorios',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

export const guardarTokenNotificaciones = async (userId, token) => {
  try {
    const userRef = doc(db, 'usuarios', userId);
    await updateDoc(userRef, {
      notificationToken: token
    });
  } catch (error) {
    console.error('Error al guardar token:', error);
  }
};

export const obtenerTokenNotificaciones = async () => {
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch (error) {
    console.error('Error al obtener token:', error);
    return null;
  }
};

export const enviarNotificacionPrueba = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "¡Prueba de notificación!",
      body: "Si ves esto, las notificaciones están funcionando correctamente",
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 }, // La notificación aparecerá en 2 segundos
  });
};

export const programarNotificacionCita = async (cita) => {
  const fechaCita = cita.fecha.toDate();
  
  // Notificación de confirmación inmediata
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "¡Cita Confirmada!",
      body: `Tu cita de ${cita.servicio} está programada para el ${fechaCita.toLocaleDateString()}`,
    },
    trigger: { seconds: 1 }
  });

  // Recordatorio 24 horas antes
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Recordatorio de Cita",
      body: `Recuerda: Mañana tienes tu cita de ${cita.servicio} a las ${cita.hora}`,
    },
    trigger: {
      date: new Date(fechaCita.getTime() - 24 * 60 * 60 * 1000)
    }
  });

  // Recordatorio el mismo día
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "¡Tu cita es hoy!",
      body: `Tu cita de ${cita.servicio} es hoy a las ${cita.hora}`,
    },
    trigger: {
      date: new Date(fechaCita.setHours(fechaCita.getHours() - 2))
    }
  });
};