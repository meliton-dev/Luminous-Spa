import { StatusBar } from "expo-status-bar";
import react from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Toast, { BaseToast } from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

import Users from './screens/Users';
import CreateUserScreen from './screens/CreateUserScreen'
import ListaUsuarios from './screens/ListaUsuarios'
import Bienvenida from './screens/Bienvenida'
import Login from './screens/Login'
import Registro from "./screens/Registro";
import Inicio from "./screens/Inicio";
import Servicios from "./screens/Servicios";
import MainTabNavigator from "./Navegacion_Barra/MainTabNavigator"; 
import Calendario from "./screens/Calendario";
import Busqueda from './screens/Busqueda'
import Cuenta from "./screens/Cuenta";
import EditarPerfil from "./screens/EditarPerfil";
import NuevaCita from "./screens/NuevaCita";
import HistorialCitas from "./screens/HistorialCitas";
import Soporte from './screens/Soporte';



function MyStack() {  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bienvenida" component={Bienvenida}/>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Registro" component={Registro}/>
      <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
      <Stack.Screen name="Inicio" component={Inicio}/>
      <Stack.Screen name="Busqueda" component={Busqueda}/>
      <Stack.Screen name="Servicios" component={Servicios}/>
      <Stack.Screen name="Calendario" component={Calendario}/>
      <Stack.Screen name="Cuenta" component={Cuenta}/>
      <Stack.Screen name="ListaUsuarios" component={ListaUsuarios}/>
      <Stack.Screen name="Users" component={Users}/>
      <Stack.Screen name="CreateUserScreen" component={CreateUserScreen}/>
      <Stack.Screen name="EditarPerfil" component={EditarPerfil}/>
      <Stack.Screen name="NuevaCita" component={NuevaCita}/>
      <Stack.Screen name="HistorialCitas" component={HistorialCitas}/>
      <Stack.Screen name="Soporte" component={Soporte}/>

    </Stack.Navigator>
  )
}

// Añadir esta configuración antes de MyStack
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'rgb(53,109,79)',
        backgroundColor: 'white',
        height: 'auto',
        padding: 12,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 20,
        fontWeight: '600',
        color: 'rgb(53,109,79)',
      }}
      text2Style={{
        fontSize: 16,
        color: '#333',
      }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#FF0000',
        backgroundColor: 'white',
        height: 'auto',
        padding: 12,
        marginTop: 15, // Ajustamos el margen superior
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: '600',
        color: '#FF0000',
      }}
      text2Style={{
        fontSize: 16,
        color: '#333',
      }}
    />
  ),
};

export default function App() {
  return (
    <>
      <NavigationContainer>
        <MyStack/>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
