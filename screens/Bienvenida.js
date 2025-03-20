import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importa los iconos (si los usas)
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación



const Bienvenida = () => {
  const navigation = useNavigation(); // Usamos useNavigation() para navegar

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={require('../assets/icono_Spa.png')} style={styles.icono}/>
      </View>
      <View style={styles.buttonContainer} >
        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Empezar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(195, 217, 202)',
    justifyContent: 'space-between', // Distribuye el espacio entre los elementos
  },
  
  iconContainer: {
    flex: 1, // Ocupa la mayor parte del espacio disponible
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  buttonContainer: {
    padding: 80, // Espacio alrededor del botón
    alignItems: 'center', // Centra el botón horizontalmente
  },
  button: {
    backgroundColor: 'rgb(53,109,79)', // Color del botón
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  icono: {
    width: 250, // Ajusta el ancho según tus necesidades
    height: 250, // Ajusta la altura según tus necesidades
  },

});

export default Bienvenida;