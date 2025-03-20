import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth } from '../database/firebase';
import { crearCita } from '../services/citasService';
import { obtenerServicios } from '../services/serviciosService';
import { MaterialIcons } from '@expo/vector-icons';
import { configurarNotificaciones, enviarNotificacionPrueba } from '../services/servicesCuenta';
import { obtenerCitasUsuario } from '../services/citasService';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../database/firebase';
// Primero, añadir la importación de Toast
import Toast from 'react-native-toast-message';

export default function NuevaCita({ navigation, route }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  const horarios = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    cargarServicios();
    configurarNotificaciones();
    if (route.params?.servicio) {
      setSelectedService(route.params.servicio);
    }
  }, []);

  const verificarHorariosDisponibles = async (fecha) => {
    try {
      // Crear fechas de inicio y fin del día con ajuste de zona horaria
      const startOfDay = new Date(fecha + 'T00:00:00');
      const offset = startOfDay.getTimezoneOffset();
      startOfDay.setMinutes(startOfDay.getMinutes() - offset);
      
      const endOfDay = new Date(fecha + 'T23:59:59');
      endOfDay.setMinutes(endOfDay.getMinutes() - offset);

      const citasRef = collection(db, 'citas');
      const q = query(
        citasRef,
        where('fecha', '>=', startOfDay),
        where('fecha', '<=', endOfDay)
      );
      const querySnapshot = await getDocs(q);
      
      const horariosOcupados = querySnapshot.docs.map(doc => doc.data().hora);
      const disponibles = horarios.filter(hora => !horariosOcupados.includes(hora));
      setHorariosDisponibles(disponibles);
      setSelectedTime('');
    } catch (error) {
      console.error('Error al verificar horarios:', error);
      setHorariosDisponibles(horarios);
    }
  };

  const cargarServicios = async () => {
    const serviciosData = await obtenerServicios();
    setServicios(serviciosData);
  };

// Modificar el handleReservar para usar Toast
  const handleReservar = async () => {
    if (!selectedDate || !selectedTime || !selectedService) {
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Por favor selecciona fecha, hora y servicio',
        topOffset: 60,
      });
      return;
    }

    setLoading(true);
    try {
      // Corregir el manejo de la fecha
      const [hours, minutes] = selectedTime.split(':');
      const fechaCita = new Date(selectedDate + 'T00:00:00');
      fechaCita.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Ajustar la fecha para la zona horaria local
      const offset = fechaCita.getTimezoneOffset();
      fechaCita.setMinutes(fechaCita.getMinutes() - offset);

      const citaData = {
        clienteId: auth.currentUser.uid,
        fecha: fechaCita,
        hora: selectedTime,
        servicio: selectedService.nombre,
        servicioId: selectedService.id,
        precio: selectedService.precio || 0,
        duracion: selectedService.duracion || 0,
        estado: 'pendiente',
        createdAt: new Date(),
        terapeuta: selectedService.terapeuta || 'Sin asignar',
        clienteEmail: auth.currentUser.email // Añadido para referencia
      };

      // Verificar disponibilidad una vez más antes de guardar
      const citasRef = collection(db, 'citas');
      const q = query(
        citasRef,
        where('fecha', '==', fechaCita),
        where('hora', '==', selectedTime)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        Alert.alert('Error', 'Este horario ya no está disponible. Por favor selecciona otro.');
        return;
      }

      await addDoc(collection(db, 'citas'), citaData);
      await enviarNotificacionPrueba();
      Toast.show({
        type: 'success',
        text1: '¡Éxito!',
        text2: 'Tu cita ha sido agendada correctamente',
        topOffset: 60,
      });
      navigation.navigate('MainTabNavigator', { screen: 'Calendario' });
    } catch (error) {
      console.error('Error al agendar cita:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo agendar la cita. Intenta de nuevo',
        topOffset: 60,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="rgb(53,109,79)" />
        </TouchableOpacity>
        <Text style={styles.title}>Agendar Nueva Cita</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecciona una fecha</Text>
        <Calendar
          minDate={new Date().toISOString().split('T')[0]}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            verificarHorariosDisponibles(day.dateString);
          }}
          markedDates={{
            [selectedDate]: {
              selected: true,
              selectedColor: 'rgb(53,109,79)'
            }
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horarios Disponibles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(horariosDisponibles.length > 0 ? horariosDisponibles : horarios).map((hora) => (
            <TouchableOpacity
              key={hora}
              style={[
                styles.timeButton,
                selectedTime === hora && styles.selectedTime,
                !horariosDisponibles.includes(hora) && styles.disabledTime
              ]}
              onPress={() => setSelectedTime(hora)}
              disabled={!horariosDisponibles.includes(hora)}
            >
              <Text style={[
                styles.timeText,
                selectedTime === hora && styles.selectedTimeText,
                !horariosDisponibles.includes(hora) && styles.disabledTimeText
              ]}>
                {hora}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Servicios</Text>
        <View style={styles.serviciosGrid}>
          {servicios.map((servicio) => (
            <TouchableOpacity
              key={servicio.id}
              style={[
                styles.serviceCard,
                selectedService?.id === servicio.id && styles.selectedService
              ]}
              onPress={() => setSelectedService(servicio)}
            >
              <Text style={[
                styles.serviceName,
                selectedService?.id === servicio.id && styles.selectedServiceText
              ]}>{servicio.nombre}</Text>
              <Text style={[
                styles.servicePrice,
                selectedService?.id === servicio.id && styles.selectedServiceText
              ]}>${servicio.precio}</Text>
              <Text style={[
                styles.serviceDuration,
                selectedService?.id === servicio.id && styles.selectedServiceText
              ]}>{servicio.duracion} min</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.reservarButton,
          loading && styles.reservarButtonDisabled
        ]}
        onPress={handleReservar}
        disabled={loading}
      >
        <View style={styles.reservarButtonContent}>
          {loading ? (
            <ActivityIndicator color="white" size="small" style={styles.buttonLoader} />
          ) : (
            <MaterialIcons name="check-circle" size={24} color="white" style={styles.buttonIcon} />
          )}
          <Text style={styles.reservarButtonText}>
            {loading ? 'Reservando...' : 'Confirmar Reserva'}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Añadir nuevos estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(53,109,79)',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  timeButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTime: {
    backgroundColor: 'rgb(53,109,79)',
  },
  timeText: {
    color: '#333',
  },
  selectedTimeText: {
    color: 'white',
  },
  serviceCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginRight: 15,
    minWidth: 150,
    elevation: 2, // Añadir sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  reservarButton: {
    backgroundColor: 'rgb(53,109,79)',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reservarButtonDisabled: {
    backgroundColor: 'rgba(53,109,79,0.7)',
  },
  reservarButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reservarButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonLoader: {
    marginRight: 8,
  },
  disabledTime: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  disabledTimeText: {
    color: '#999',
  },


  serviciosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  serviceCard: {
    width: '48%', // Casi la mitad del ancho para crear dos columnas
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  selectedService: {
    backgroundColor: 'rgb(53,109,79)',
    borderColor: 'rgb(53,109,79)',
    borderWidth: 2,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  servicePrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
  },
  selectedServiceText: {
    color: 'white',
  },
});