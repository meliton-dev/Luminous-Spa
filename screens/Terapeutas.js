import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../database/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function TerapeutasScreen({ navigation }) {
  const [terapeutas, setTerapeutas] = useState([]);

  useEffect(() => {
    cargarTerapeutas();
  }, []);

  const cargarTerapeutas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'terapeutas'));
      const terapeutasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTerapeutas(terapeutasData);
    } catch (error) {
      console.error('Error al cargar terapeutas:', error);
    }
  };

  const renderTerapeuta = ({ item }) => (
    <TouchableOpacity 
      style={styles.terapeutaCard}
      onPress={() => navigation.navigate('NuevaCita', { terapeuta: item })}
    >
      <Image 
        source={item.foto ? { uri: item.foto } : require('../assets/default-avatar.png')} 
        style={styles.terapeutaFoto}
      />
      <View style={styles.terapeutaInfo}>
        <Text style={styles.terapeutaNombre}>{item.nombre}</Text>
        <Text style={styles.terapeutaEspecialidad}>
          {item.especialidades.join(' • ')}
        </Text>
        <View style={styles.calificacion}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.calificacionTexto}>{item.calificacion}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={terapeutas}
        renderItem={renderTerapeuta}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  lista: {
    padding: 15,
  },
  terapeutaCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
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
  terapeutaFoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  terapeutaInfo: {
    marginLeft: 15,
    flex: 1,
  },
  terapeutaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  terapeutaEspecialidad: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  calificacion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  calificacionTexto: {
    marginLeft: 5,
    color: '#666',
  },
});