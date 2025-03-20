import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../database/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, onSnapshot } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configurarNotificaciones, actualizarPreferenciasNotificaciones } from '../services/servicesCuenta';

export default function Cuenta({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [notificacionesActivas, setNotificacionesActivas] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(collection(db, "usuarios"), where("uid", "==", auth.currentUser.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            setUserData(querySnapshot.docs[0].data());
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    const unsubscribeNav = navigation.addListener('focus', fetchUserData);
    return unsubscribeNav;
  }, [navigation]);

  // Añadir este useEffect justo después del primer useEffect
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem(`userProfile_${auth.currentUser.uid}`);
        if (savedImage && userData) {
          setUserData(prevData => ({ ...prevData, photoURL: savedImage }));
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
      }
    };
    loadProfileImage();
  }, [userData?.uid]);

  const handleProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso Requerido', 'Necesitamos acceso a tu galería para cambiar la foto de perfil');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        // Guardar en AsyncStorage
        await AsyncStorage.setItem(`userProfile_${auth.currentUser.uid}`, imageUri);
        // Actualizar el estado
        setUserData(prevData => ({ ...prevData, photoURL: imageUri }));
        Alert.alert('¡Éxito!', 'Tu foto de perfil ha sido actualizada');
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen. Por favor, intenta de nuevo');
    }
  };

  const handleSoporte = () => {
    navigation.navigate('Soporte');
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, cerrar sesión",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    const inicializarNotificaciones = async () => {
      const permiso = await configurarNotificaciones();
      setNotificacionesActivas(permiso);
    };
    inicializarNotificaciones();
  }, []);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={handleProfileImage}>
              <Image
                source={
                  userData?.photoURL
                    ? { uri: userData.photoURL }
                    : require('../assets/default-avatar.png')
                }
                style={styles.avatar}
              />
              <View style={styles.editImageButton}>
                <MaterialIcons name="camera-alt" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.nombre}>{userData.nombre}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>
      </View>

      <View style={styles.seccion}>
        <TouchableOpacity
          style={styles.opcion}
          onPress={() => navigation.navigate('EditarPerfil', { userData })}
        >
          <MaterialIcons name="edit" size={24} color="rgb(53,109,79)" />
          <Text style={styles.opcionTexto}>Editar Perfil</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.opcion}
          onPress={() => navigation.navigate('HistorialCitas')}
        >
          <MaterialIcons name="history" size={24} color="rgb(53,109,79)" />
          <Text style={styles.opcionTexto}>Historial de Citas</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.opcion}
          onPress={async () => {
            const nuevoEstado = !notificacionesActivas;
            const permiso = nuevoEstado ? await configurarNotificaciones() : true;
            setNotificacionesActivas(permiso && nuevoEstado);
            await actualizarPreferenciasNotificaciones(auth.currentUser.uid, {
              recordatorios: nuevoEstado,
              promociones: nuevoEstado
            });
          }}
        >
          <MaterialIcons name="notifications" size={24} color="rgb(53,109,79)" />
          <Text style={styles.opcionTexto}>Notificaciones</Text>
          <MaterialIcons
            name={notificacionesActivas ? "toggle-on" : "toggle-off"}
            size={24}
            color={notificacionesActivas ? "rgb(53,109,79)" : "#666"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.opcion}
          onPress={handleSoporte}
        >
          <MaterialIcons name="help" size={24} color="rgb(53,109,79)" />
          <Text style={styles.opcionTexto}>Ayuda y Soporte</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botonCerrarSesion} onPress={handleLogout}>
        <Text style={styles.botonCerrarSesionTexto}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
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
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  seccion: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 10,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  opcionTexto: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  botonCerrarSesion: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    alignItems: 'center',
  },
  botonCerrarSesionTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editImageButton: {
    position: 'absolute',
    right: -5,
    bottom: 0,
    backgroundColor: 'rgb(53,109,79)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
});