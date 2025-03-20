import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../database/firebase';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const servicios = [
  { 
    id: '1', 
    nombre: 'Masaje Relajante', 
    imagen: require('../assets/masaje.jpg'),
    descripcion: 'Libera el estrés y la tensión',
    duracion: '60 min',
    precio: '$600'
  },
  { 
    id: '2', 
    nombre: 'Exfoliación Corporal', 
    imagen: require('../assets/exfoliacion.jpeg'),
    descripcion: 'Renueva tu piel',
    duracion: '45 min',
    precio: '$500'
  },
  { 
    id: '3', 
    nombre: 'Facial Premium', 
    imagen: require('../assets/masaje.jpg'),
    descripcion: 'Tratamiento facial completo',
    duracion: '75 min',
    precio: '$800'
  },
];

export default function Inicio() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  // Replace useEffect with useFocusEffect
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      if (auth.currentUser) {
        const q = query(
          collection(db, "usuarios"),
          where("uid", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserName(userData.nombre || '');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const renderServicioCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.servicioCard}
      onPress={() => navigation.navigate('NuevaCita', { servicio: item })}
    >
      <Image source={item.imagen} style={styles.servicioImagen} />
      <View style={styles.servicioInfo}>
        <Text style={styles.servicioNombre}>{item.nombre}</Text>
        <Text style={styles.servicioDescripcion}>{item.descripcion}</Text>
        <View style={styles.servicioDetalles}>
          <View style={styles.servicioDetalle}>
            <MaterialIcons name="access-time" size={16} color="rgb(53,109,79)" />
            <Text style={styles.servicioDetalleTexto}>{item.duracion}</Text>
          </View>
          <Text style={styles.servicioPrecio}>{item.precio}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.saludo}>¡Bienvenido a</Text>
          <Text style={styles.nombreSpa}>Luminous Spa!</Text>
          <Text style={styles.nombreUsuario}>{userName || 'Usuario'}</Text>
          <View style={styles.decorativeLine} />
        </View>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={() => navigation.navigate('Cuenta')}
        >
          <MaterialIcons name="account-circle" size={40} color="rgb(53,109,79)" />
        </TouchableOpacity>
      </View>

      <View style={styles.promocionContainer}>
        <Image 
          source={require('../assets/imagenMasaje.jpg')} 
          style={styles.promocionImagen}
        />
        <View style={styles.promocionOverlay}>
          <Text style={styles.promocionTexto}>Especial del Mes</Text>
          <Text style={styles.promocionDescuento}>20% OFF</Text>
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.seccionTitulo}>Nuestros Servicios</Text>
        <FlatList
          data={servicios}
          renderItem={renderServicioCard}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.serviciosLista}
        />
      </View>

      <TouchableOpacity 
        style={styles.botonReserva}
        onPress={() => navigation.navigate('Calendario')}
      >
        <Text style={styles.botonReservaTexto}>Agendar Cita</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  welcomeContainer: {
    flex: 1,
    marginRight: 15,
  },
  saludo: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  nombreSpa: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(53,109,79)',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  nombreUsuario: {
    fontSize: 20,
    color: '#333',
    fontWeight: '500',
    marginBottom: 10,
  },
  decorativeLine: {
    width: 50,
    height: 3,
    backgroundColor: 'rgb(53,109,79)',
    borderRadius: 2,
    marginTop: 5,
  },
  profileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(53,109,79,0.1)',
  },
  promocionContainer: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    height: 200,
  },
  promocionImagen: {
    width: '100%',
    height: '100%',
  },
  promocionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  promocionTexto: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  promocionDescuento: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  seccion: {
    padding: 20,
  },
  seccionTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  serviciosLista: {
    paddingRight: 20,
  },
  servicioCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  servicioImagen: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  servicioInfo: {
    padding: 15,
  },
  servicioNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  servicioDescripcion: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  servicioDetalles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  servicioDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicioDetalleTexto: {
    marginLeft: 5,
    color: '#666',
  },
  servicioPrecio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgb(53,109,79)',
  },
  botonReserva: {
    backgroundColor: 'rgb(53,109,79)',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonReservaTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
