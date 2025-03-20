import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import { db } from "../database/firebase"; // Importa la configuración de Firebase
import { collection, getDocs } from "firebase/firestore"; // Importar Firestore
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación



const UsersList = () => {
  const navigation = useNavigation(); // Usamos useNavigation() para navegar
  // Estado para almacenar los datos obtenidos de Firestore 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Para mostrar un estado de carga

  useEffect(() => {
    // Función que obtiene los datos desde Firestore
    const fetchUsers = async () => {
      try {
        // Referencia a la colección "users"
        const querySnapshot = await getDocs(collection(db, "users"));
        
        // Mapea los documentos y obtiene los datos
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,  // Agrega el ID del documento
          ...doc.data(), // Obtiene todos los datos del documento
        }));

        // Guarda los datos en el estado
        setUsers(usersList);
      } catch (error) {
        console.error("Error al obtener los usuarios: ", error);
      } finally {
        setLoading(false); // Termina la carga
      }
    };

    // Llama a la función para obtener los usuarios
    fetchUsers();
  }, []); // El array vacío significa que esto solo se ejecuta una vez, cuando el componente se monta

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    alert('cargando...')
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Button title="Crear Usuario" onPress={() => navigation.navigate('Users')} /> {/* Usamos navigation aquí */}
      </View>
      <View>
        {users.length === 0 ? (
          <Text>No hay usuarios disponibles.</Text>
        ) : (
          users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <Text style={styles.userName}>{user.nombre}</Text>
              <Text>{user.email}</Text>
              <Text>{user.telefono}</Text>
              <Button title="Ver Detalles" onPress={() => { /* Navegar a la vista de detalles */ }} />
            
            </View>
          ))
        )}
      </View>
      

      {

      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UsersList;
