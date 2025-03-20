import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal } from 'react-native';
import { obtenerCitasUsuario, actualizarEstadoCita } from '../services/citasService';
import { auth } from '../database/firebase';

export default function CalendarioScreen({ navigation }) {
  const [citasMarked, setCitasMarked] = useState({});
  const [citasDelDia, setCitasDelDia] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  useEffect(() => {
    cargarCitas();
    const unsubscribe = navigation.addListener('focus', cargarCitas);
    return unsubscribe;
  }, [navigation]);

  const cargarCitas = async () => {
    try {
      const citas = await obtenerCitasUsuario(auth.currentUser.uid);
      const marked = {};
      
      citas.forEach(cita => {
        const fecha = cita.fecha.toDate();
        const dateString = fecha.toISOString().split('T')[0];
        marked[dateString] = {
          marked: true,
          dotColor: getEstadoColor(cita.estado)
        };
      });

      setCitasMarked(marked);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setLoading(false);
    }
  };

  const cargarCitasDelDia = async (date) => {
    try {
      const citas = await obtenerCitasUsuario(auth.currentUser.uid);
      const citasFiltradas = citas.filter(cita => {
        const fechaCita = cita.fecha.toDate().toISOString().split('T')[0];
        return fechaCita === date;
      });
      setCitasDelDia(citasFiltradas);
    } catch (error) {
      console.error('Error al cargar citas del día:', error);
    }
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: '#FFC107',
      confirmada: '#4CAF50',
      cancelada: '#F44336',
      completada: '#2196F3'
    };
    return colores[estado] || '#757575';
  };

  const onDayPress = (day) => {
    // Aseguramos que la fecha seleccionada use la zona horaria local
    const fecha = new Date(day.dateString + 'T00:00:00');
    setSelectedDate(day.dateString);
    cargarCitasDelDia(day.dateString);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgb(53,109,79)" />
      </View>
    );
  }

  const handlePressCita = (cita) => {
    setCitaSeleccionada(cita);
    setModalVisible(true);
  };

  const handleCancelarCita = async () => {
    // Verificar el tiempo antes de la cita
    const ahora = new Date();
    const horaCita = citaSeleccionada.fecha.toDate();
    const horasRestantes = (horaCita - ahora) / (1000 * 60 * 60);

    if (horasRestantes < 24) {
      Alert.alert(
        'Aviso',
        'Las cancelaciones deben realizarse con 24 horas de anticipación. ¿Desea reprogramar la cita?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Reprogramar',
            style: 'default',
            onPress: () => {
              setModalVisible(false);
              navigation.navigate('NuevaCita', {
                citaAnterior: citaSeleccionada,
                isReprogramacion: true
              });
            }
          }
        ]
      );
      return;
    }

    Alert.alert(
      'Cancelar Cita',
      '¿Estás seguro que deseas cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await actualizarEstadoCita(citaSeleccionada.id, 'cancelada');
              Alert.alert('Éxito', 'La cita ha sido cancelada');
              setModalVisible(false);
              cargarCitas();
            } catch (error) {
              console.log(error)
              Alert.alert('Error', 'No se pudo cancelar la cita');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Calendario de Citas</Text>
        <TouchableOpacity
          style={styles.botonNuevaCita}
          onPress={() => navigation.navigate('NuevaCita')}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainContent}>
        <Calendar
          markedDates={{
            ...citasMarked,
            [selectedDate]: {
              ...citasMarked[selectedDate],
              selected: true,
              selectedColor: 'rgb(53,109,79)'
            }
          }}
          onDayPress={onDayPress}
          theme={{
            selectedDayBackgroundColor: 'rgb(53,109,79)',
            todayTextColor: 'rgb(53,109,79)',
            arrowColor: 'rgb(53,109,79)',
            monthTextColor: 'rgb(53,109,79)',
            textMonthFontWeight: 'bold',
            textDayFontSize: 16,
            textMonthFontSize: 18,
          }}
        />

        <View style={styles.citasContainer}>
          <Text style={styles.citasTitulo}>
            {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Selecciona una fecha'}
          </Text>

          <View style={styles.citasList}>
            {citasDelDia.length > 0 ? (
              citasDelDia.map(cita => (
                <TouchableOpacity
                  key={cita.id}
                  style={styles.citaCard}
                  onPress={() => handlePressCita(cita)}
                >
                  <View style={styles.citaInfo}>
                    <Text style={styles.citaHora}>{cita.hora}</Text>
                    <Text style={styles.citaServicio}>{cita.servicio}</Text>
                    <Text style={styles.citaTerapeuta}>{cita.terapeuta}</Text>
                  </View>
                  <View style={[
                    styles.estadoBadge,
                    { backgroundColor: getEstadoColor(cita.estado) }
                  ]}>
                    <Text style={styles.estadoTexto}>{cita.estado}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noCitas}>
                No hay citas programadas para este día
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>

            {citaSeleccionada && (
              <>
                <Text style={styles.modalTitle}>Detalle de la Cita</Text>
                <View style={styles.detalleContainer}>
                  <Text style={styles.label}>Servicio</Text>
                  <Text style={styles.value}>{citaSeleccionada.servicio}</Text>

                  <Text style={styles.label}>Fecha</Text>
                  <Text style={styles.value}>
                    {citaSeleccionada.fecha.toDate().toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>

                  <Text style={styles.label}>Hora</Text>
                  <Text style={styles.value}>{citaSeleccionada.hora}</Text>

                  <Text style={styles.label}>Duración</Text>
                  <Text style={styles.value}>{citaSeleccionada.duracion} min</Text>

                  <Text style={styles.label}>Precio</Text>
                  <Text style={styles.value}>${citaSeleccionada.precio}</Text>

                  {citaSeleccionada.estado === 'pendiente' && (
                    <TouchableOpacity 
                      style={styles.cancelarButton}
                      onPress={handleCancelarCita}
                    >
                      <Text style={styles.cancelarButtonText}>Cancelar Cita</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      
    </View>
  );
} // Cerrar el componente CalendarioScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(53,109,79)',
  },
  botonNuevaCita: {
    backgroundColor: 'rgb(53,109,79)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
  },
  citasContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40, // Agregar padding inferior para mejor scroll
  },
  citasList: {
    marginTop: 10,
  },
  citasTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  citasList: {
    flex: 1,
  },
  citaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  citaInfo: {
    flex: 1,
  },
  citaHora: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  citaServicio: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  citaTerapeuta: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  estadoTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noCitas: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(53,109,79)',
    marginBottom: 20,
    textAlign: 'center',
  },
  detalleContainer: {
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 15,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginTop: 5,
  },
  cancelarButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  reprogramarButton: {
    backgroundColor: 'rgb(53,109,79)',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); // Cerrar StyleSheet.create
