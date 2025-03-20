import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../database/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Campos requeridos',
        text2: 'Por favor ingresa todos los campos',
        visibilityTime: 3000,
        topOffset: 0,
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Toast.show({
        type: 'success',
        text1: '¡Bienvenido!',
        text2: `Has iniciado sesión como ${userCredential.user.email}`,
        visibilityTime: 3000,
        position: 'top',
      });
      navigation.navigate('MainTabNavigator');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error de acceso',
        text2: 'Usuario o contraseña incorrectos',
        visibilityTime: 4000,
        topOffset: 60,  // Ajustamos la posición vertical
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icono_Spa.png')} style={styles.logo} />
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={styles.registerButtonText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
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
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgb(53,109,79)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    color: 'rgb(53,109,79)',
    fontSize: 14,
  },
});

export default Login;