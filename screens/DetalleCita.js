import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { actualizarEstadoCita } from '../services/citasService';

export default function DetalleCita({ route, navigation }) {
  const { cita } = route.params;

  const handleCancelar = async () => {
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
              await actualizarEstadoCita(cita.id, 'cancelada');
              Alert.alert('Éxito', 'La cita ha sido cancelada');
              navigation.goBack();
            } catch (error) {
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="rgb(53,109,79)" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Detalle de la Cita</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Servicio</Text>
        <Text style={styles.value}>{cita.servicio}</Text>

        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.value}>
          {new Date(cita.fecha.seconds * 1000).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>

        <Text style={styles.label}>Hora</Text>
        <Text style={styles.value}>{cita.hora}</Text>

        <Text style={styles.label}>Duración</Text>
        <Text style={styles.value}>{cita.duracion} minutos</Text>

        <Text style={styles.label}>Precio</Text>
        <Text style={styles.value}>${cita.precio}</Text>

        <Text style={styles.label}>Estado</Text>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(cita.estado) }]}>
          <Text style={styles.estadoTexto}>{cita.estado}</Text>
        </View>
      </View>

      {cita.estado === 'pendiente' && (
        <TouchableOpacity style={styles.cancelarButton} onPress={handleCancelar}>
          <Text style={styles.cancelarButtonText}>Cancelar Cita</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(53,109,79)',
    marginLeft: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 5,
  },
  estadoTexto: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
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
});