import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../database/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import Toast from 'react-native-toast-message';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
WebBrowser.maybeCompleteAuthSession();
const Registro = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.telefono || 
        !formData.email || !formData.password || !formData.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Campos incompletos',
        text2: 'Por favor, completa todos los campos',
        topOffset: 60,
      });
      return;
    }

    // Añadir validación de teléfono
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.telefono)) {
      Toast.show({
        type: 'error',
        text1: 'Teléfono inválido',
        text2: 'El teléfono debe tener exactamente 10 dígitos',
        topOffset: 60,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error en contraseña',
        text2: 'Las contraseñas no coinciden',
        topOffset: 60,
      });
      return;
    }

    if (formData.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Contraseña débil',
        text2: 'La contraseña debe tener al menos 6 caracteres',
        topOffset: 60,
      });
      return;
    }

    try {
      // Crear usuario en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Guardar datos adicionales en Firestore
      await addDoc(collection(db, "usuarios"), {
        uid: userCredential.user.uid,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        email: formData.email,
        fechaRegistro: new Date(),
      });

      Toast.show({
        type: 'success',
        text1: '¡Registro exitoso!',
        text2: 'Tu cuenta ha sido creada correctamente',
        topOffset: 60,
      });
      
      navigation.navigate("Login");
    } catch (error) {
      let errorMessage = 'Error en el registro';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo ya está registrado';
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        topOffset: 60,
      });
    }
  };
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '540938612236-185pk9jfbsd5b36s64fv0r1j0t9fjvuf.apps.googleusercontent.com',
    iosClientId: '540938612236-185pk9jfbsd5b36s64fv0r1j0t9fjvuf.apps.googleusercontent.com',
    androidClientId: '540938612236-185pk9jfbsd5b36s64fv0r1j0t9fjvuf.apps.googleusercontent.com',
  });
  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        const credential = GoogleAuthProvider.credential(result.params.id_token);
        const userCredential = await signInWithCredential(auth, credential);
        
        await addDoc(collection(db, "usuarios"), {
          uid: userCredential.user.uid,
          nombre: userCredential.user.displayName,
          email: userCredential.user.email,
          foto: userCredential.user.photoURL,
          fechaRegistro: new Date(),
        });

        Toast.show({
          type: 'success',
          text1: '¡Bienvenido!',
          text2: 'Has iniciado sesión con Google',
          topOffset: 60,
        });
        
        navigation.navigate("Inicio");
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo iniciar sesión con Google',
        topOffset: 60,
      });
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>

        <Image source={require('../assets/icono_Spa.png')} style={styles.logo} />
        <Text style={styles.title}>Crear Cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={formData.nombre}
          onChangeText={(text) => setFormData({...formData, nombre: text})}
        />

        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={formData.apellido}
          onChangeText={(text) => setFormData({...formData, apellido: text})}
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={formData.telefono}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, '');
            if (numericText.length <= 10) {
              setFormData({...formData, telefono: numericText});
            }
          }}
          keyboardType="numeric"
          maxLength={10}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
          secureTextEntry
        />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.registerButton, styles.googleButton]}
        onPress={handleGoogleSignIn}
      >
        <Image 
          source={require('../assets/google/google-icon.png')} 
          style={styles.googleIcon} 
        />
        <Text style={[styles.registerButtonText, styles.googleButtonText]}>
          Continuar con Google
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginButtonText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'rgb(53,109,79)',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(53,109,79)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 30,
  },
  loginButtonText: {
    color: 'rgb(53,109,79)',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#333',
  },
});

export default Registro;