import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import Inicio from '../screens/Inicio';
import Servicios from '../screens/Servicios';
import ListaUsuarios from '../screens/ListaUsuarios';
import Calendario from '../screens/Calendario';
import Busqueda from '../screens/Busqueda';
import Cuenta from '../screens/Cuenta';
import NuevaCita from '../screens/NuevaCita';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'Inicio') {
        iconName = focused ? 'home' : 'home-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      } else if (route.name === 'Servicios') {
        iconName = focused ? 'star' : 'star-o'; // Estrella rellena cuando está activa
        return <FontAwesome name={iconName} size={size} color={color} />;
      } else if (route.name === 'Cuenta') {
        iconName = focused ? 'person' : 'person-outline'; // Icono relleno cuando está activo
        return <Ionicons name={iconName} size={size} color={color} />;
      } else if (route.name === 'Calendario') {
        iconName = focused ? 'calendar' : 'calendar-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
       
      } else if(route.name === 'Busqueda'){
        iconName = focused ? 'search' : 'search-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      }
    },
    tabBarActiveTintColor: 'green',
    tabBarInactiveTintColor: 'gray',
  })}
>
  <Tab.Screen name="Inicio" component={Inicio} />
  <Tab.Screen name="Busqueda" component={Busqueda} />
  <Tab.Screen name="Servicios" component={Servicios} />
  <Tab.Screen name="Calendario" component={Calendario} />
  <Tab.Screen name="Cuenta" component={Cuenta} />
</Tab.Navigator>


  );
}