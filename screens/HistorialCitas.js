import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { obtenerCitasUsuario } from '../services/citasService';
import { auth } from '../database/firebase';
import { Modal } from 'react-native';

export default function HistorialCitas({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas'); // todas, pendientes, completadas

  useEffect(() => {
    cargarCitas();
    const unsubscribe = navigation.addListener('focus', cargarCitas);
    return unsubscribe;
  }, [navigation]);

  const cargarCitas = async () => {
    try {
      const citasUsuario = await obtenerCitasUsuario(auth.currentUser.uid);
      const citasOrdenadas = citasUsuario.sort((a, b) => b.fecha.toDate() - a.fecha.toDate());
      setCitas(citasOrdenadas);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarCitas = () => {
    if (filtro === 'todas') return citas;
    if (filtro === 'pendientes') {
      return citas.filter(cita => cita.estado === 'pendiente');
    }
    if (filtro === 'completadas') {
      return citas.filter(cita => cita.estado === 'completada');
    }
    if (filtro === 'canceladas') {
      return citas.filter(cita => cita.estado === 'cancelada');
    }
    return citas;
  };

  // Agregar al inicio del componente, junto a los otros estados
  const [modalVisible, setModalVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  
  // Modificar la función renderCita
  const renderCita = ({ item }) => (
    <TouchableOpacity 
      style={styles.citaCard}
      onPress={() => {
        setCitaSeleccionada(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.citaHeader}>
        <Text style={styles.citaFecha}>
          {item.fecha.toDate().toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })}
        </Text>
        <View style={[
          styles.estadoBadge,
          { backgroundColor: getEstadoColor(item.estado) }
        ]}>
          <Text style={styles.estadoTexto}>{item.estado}</Text>
        </View>
      </View>

      <View style={styles.citaInfo}>
        <View style={styles.infoRow}>
          <MaterialIcons name="spa" size={20} color="rgb(53,109,79)" />
          <Text style={styles.servicioTexto}>{item.servicio}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={20} color="rgb(53,109,79)" />
          <Text style={styles.horaTexto}>{item.hora}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={20} color="rgb(53,109,79)" />
          <Text style={styles.terapeutaTexto}>{item.terapeuta}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: '#FFC107',
      confirmada: '#4CAF50',
      cancelada: '#F44336',
      completada: '#2196F3'
    };
    return colores[estado] || '#757575';
  };

  const getEstadoIcon = (estado) => {
    const iconos = {
      pendiente: 'schedule',
      confirmada: 'check-circle',
      cancelada: 'cancel',
      completada: 'done-all'
    };
    return iconos[estado] || 'help';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgb(53,109,79)" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Historial de Citas</Text>
      </View>

      <View style={styles.filtros}>
        {['todas', 'pendientes', 'completadas', 'canceladas'].map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filtroBoton,
              filtro === f && styles.filtroActivo
            ]}
            onPress={() => setFiltro(f)}
          >
            <Text style={[
              styles.filtroTexto,
              filtro === f && styles.filtroTextoActivo
            ]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtrarCitas()}
        renderItem={renderCita}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.citasList}
        showsVerticalScrollIndicator={false}
      />

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

                  <Text style={styles.label}>Estado</Text>
                  <View style={[
                    styles.modalEstadoBadge,
                    { backgroundColor: getEstadoColor(citaSeleccionada.estado) }
                  ]}>
                    <MaterialIcons 
                      name={getEstadoIcon(citaSeleccionada.estado)} 
                      size={20} 
                      color="white" 
                    />
                    <Text style={styles.modalEstadoTexto}>
                      {citaSeleccionada.estado}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(53,109,79)',
  },
  filtros: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexWrap: 'wrap',
    gap: 8,
  },
  filtroBoton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F6F8',
  },
  filtroActivo: {
    backgroundColor: 'rgb(53,109,79)',
  },
  filtroTexto: {
    color: '#666',
    fontSize: 14,
  },
  filtroTextoActivo: {
    color: 'white',
    fontWeight: '500',
  },
  citasList: {
    padding: 15,
    paddingBottom: 30,
  },
  citaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  citaFecha: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  estadoTexto: {
    color: 'white',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  citaInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  servicioTexto: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
  },
  horaTexto: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  terapeutaTexto: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
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
  modalEstadoBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      marginTop: 5,
      alignSelf: 'flex-start',
    },
    modalEstadoTexto: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 8,
      textTransform: 'capitalize',
    },
});