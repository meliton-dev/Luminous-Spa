import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../database/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function PerfilScreen({ navigation }) {
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    nombre: '',
    telefono: '',
    email: '',
  });

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const docRef = doc(db, 'usuarios', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del usuario');
    }
  };

  const handleGuardar = async () => {
    try {
      const docRef = doc(db, 'usuarios', auth.currentUser.uid);
      await updateDoc(docRef, userData);
      Alert.alert('Éxito', 'Datos actualizados correctamente');
      setEditMode(false);
    } catch (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    }
  };

  const handleCerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, cerrar sesión',
          onPress: async () => {
            try {
              await auth.signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="account-circle" size={100} color="rgb(53,109,79)" />
        <Text style={styles.nombreUsuario}>{userData.nombre}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoTitulo}>Información Personal</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setEditMode(!editMode)}
          >
            <MaterialIcons 
              name={editMode ? "check" : "edit"} 
              size={24} 
              color="rgb(53,109,79)" 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContent}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nombre</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={userData.nombre}
                onChangeText={(text) => setUserData({...userData, nombre: text})}
              />
            ) : (
              <Text style={styles.infoValue}>{userData.nombre}</Text>
            )}
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={userData.telefono}
                onChangeText={(text) => setUserData({...userData, telefono: text})}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoValue}>{userData.telefono}</Text>
            )}
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
          </View>
        </View>

        {editMode && (
          <TouchableOpacity 
            style={styles.guardarButton}
            onPress={handleGuardar}
          >
            <Text style={styles.guardarButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity 
        style={styles.cerrarSesionButton}
        onPress={handleCerrarSesion}
      >
        <Text style={styles.cerrarSesionText}>Cerrar Sesión</Text>
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
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
  },
  nombreUsuario: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  infoContainer: {
    backgroundColor: 'white',
    margin: 20,
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
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 5,
  },
  infoContent: {
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(53,109,79)',
    paddingVertical: 5,
  },
  guardarButton: {
    backgroundColor: 'rgb(53,109,79)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  guardarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cerrarSesionButton: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F44336',
  },
  cerrarSesionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});