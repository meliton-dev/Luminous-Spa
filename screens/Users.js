import React, { useState } from "react";
import { View, Button, TextInput, ScrollView, StyleSheet, Text } from "react-native"; // Importar Text
import { db } from "../database/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

const Users = () => {
  const navigation = useNavigation();

  const [state, setState] = useState({
    name: "",
    email: "",
    phone: "",
    tipo_usuario: "",
    foto_perfil: "",
  });

  const [mensaje, setMensaje] = useState(""); // Estado para mostrar mensajes en pantalla

  const changeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const saveUser = async () => {
    if (!state.name || !state.email || !state.phone) {
      setMensaje("⚠️ Todos los campos son obligatorios");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        nombre: state.name,
        email: state.email,
        telefono: state.phone, // 🔹 Quita la tilde para Firestore
        tipo_usuario: state.tipo_usuario,
        foto_perfil: state.foto_perfil,
        fecha_registro: new Date(),
      });

      console.log("✅ Usuario agregado correctamente");
      alert("✅ Usuario agregado correctamente"); // Mostrar mensaje en pantalla
      setTimeout(() => {
        navigation.navigate("ListaUsuarios");
      }, 2000);
    } catch (e) {
      console.error("❌ Error al agregar usuario: ", e);
      setMensaje("❌ Error al agregar usuario"); // Mostrar mensaje de error
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputGroup}>
        <TextInput placeholder="Nombre" onChangeText={(value) => changeText("name", value)} />
      </View>
      <View style={styles.inputGroup}>
        <TextInput placeholder="Email" onChangeText={(value) => changeText("email", value)} />
      </View>
      <View style={styles.inputGroup}>
        <TextInput placeholder="Teléfono" onChangeText={(value) => changeText("phone", value)} />
      </View>
      <View style={styles.inputGroup}>
        <TextInput placeholder="Tipo de usuario" onChangeText={(value) => changeText("tipo_usuario", value)} />
      </View>
      <View style={styles.inputGroup}>
        <TextInput placeholder="Foto de perfil" onChangeText={(value) => changeText("foto_perfil", value)} />
      </View>

      <View>
        <Button title="Añadir Usuario" onPress={saveUser} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  mensaje: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
    color: "red", // 🔴 Cambia el color según el tipo de mensaje
  },
});

export default Users;
