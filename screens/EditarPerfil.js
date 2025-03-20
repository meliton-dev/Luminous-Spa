import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../database/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

export default function EditarPerfil({ route, navigation }) {
  const { userData } = route.params;
  const [nombre, setNombre] = useState(userData?.nombre || '');
  const [telefono, setTelefono] = useState(userData?.telefono || '');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    // Validación del nombre
    if (!nombre.trim() || nombre.trim().length < 3) {
      Toast.show({
        type: 'error',
        text1: 'Nombre inválido',
        text2: 'El nombre debe tener al menos 3 caracteres',
        visibilityTime: 3000,
        topOffset: 0,
      });
      return;
    }

    // Validación del teléfono
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(telefono)) {
      Toast.show({
        type: 'error',
        text1: 'Teléfono inválido',
        text2: 'El teléfono debe tener 10 dígitos',
        visibilityTime: 3000,
        topOffset: 0,
      });
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "usuarios"),
        where("uid", "==", userData.uid)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "usuarios", userDoc.id), {
          nombre: nombre,
          telefono: telefono
        });

        Toast.show({
          type: 'success',
          text1: '¡Perfil Actualizado!',
          text2: 'Tus datos han sido actualizados',
          visibilityTime: 3000,
          position: 'top',
        });
        
        // Actualizar navegación
        navigation.navigate('MainTabNavigator', {
          screen: 'Perfil',
          params: { refresh: true }
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar el perfil',
        visibilityTime: 4000,
        topOffset: 60,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgb(53,109,79)" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ 
        flexGrow: 1,
        justifyContent: 'center'  // Moved from container style to here
      }}
    >
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="rgb(53,109,79)" />
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="rgb(53,109,79)" />
            <TextInput
              style={styles.input}
              value={telefono}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                if (numericText.length <= 10) {
                  setTelefono(numericText);
                }
              }}
              placeholder="Tu número de teléfono"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="rgb(53,109,79)" />
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userData?.email}
              editable={false}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.guardarButton}
          onPress={handleGuardar}
        >
          <Text style={styles.guardarButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    // Remove justifyContent from here
  },
  formContainer: {
    padding: 20,
    // Remove justifyContent from here if present
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  disabledInput: {
    color: '#666',
    backgroundColor: '#F5F5F5',
  },
  guardarButton: {
    backgroundColor: 'rgb(53,109,79)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  guardarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',  // Match container background
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});