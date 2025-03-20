import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../database/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Servicios = () => {
  const navigation = useNavigation();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerServicios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "servicios"));
        const serviciosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServicios(serviciosData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
        setLoading(false);
      }
    };

    obtenerServicios();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="rgb(53,109,79)" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuestros Servicios</Text>
      <ScrollView>
        {servicios.map((servicio) => (
          <TouchableOpacity 
            key={servicio.id}
            style={styles.servicioCard}
            onPress={() => navigation.navigate('NuevaCita', { servicio })}
          >
            <Image 
              source={{ uri: servicio.imagenUrl }} 
              style={styles.imagen}
              defaultSource={require('../assets/masaje.jpg')}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.nombreServicio}>{servicio.nombre}</Text>
              <Text style={styles.detalles}>Duración: {servicio.duracion} min</Text>
              <Text style={styles.detalles}>Precio: ${servicio.precio}</Text>
              <Text style={styles.descripcion}>{servicio.descripcion}</Text>
              <TouchableOpacity 
                style={styles.botonReservar}
                onPress={() => navigation.navigate('NuevaCita', { servicio })}
              >
                <Text style={styles.textoBoton}>Reservar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'rgb(53,109,79)',
    textAlign: 'center',
  },
  servicioCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imagen: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  infoContainer: {
    padding: 15,
  },
  nombreServicio: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detalles: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  botonReservar: {
    backgroundColor: 'rgb(53,109,79)',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Servicios;