import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

export const programarNotificacionCita = async (cita) => {
  const trigger = new Date(cita.fecha);
  trigger.setHours(trigger.getHours() - 1); // Notificar 1 hora antes

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de Cita',
      body: `Tu cita de ${cita.servicio} es en 1 hora`,
      data: { citaId: cita.id },
    },
    trigger,
  });
};