import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Soporte({ navigation }) {
  const faqItems = [
    {
      title: '¿Cómo cancelar una cita?',
      content: 'Puedes cancelar tu cita desde la sección "Mis Citas" hasta 24 horas antes.'
    },
    {
      title: '¿Cómo cambiar mi contraseña?',
      content: 'Ve a "Editar Perfil" y selecciona la opción de cambiar contraseña.'
    },
    {
      title: '¿Cómo funcionan las notificaciones?',
      content: 'Recibirás recordatorios 24 horas y 1 hora antes de tu cita.'
    }
  ];

  const contactInfo = {
    phone: '+52 123 456 7890',
    email: 'soporte@tuspa.com',
    whatsapp: '+52 123 456 7890'
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="rgb(53,109,79)" />
        </TouchableOpacity>
        <Text style={styles.title}>Ayuda y Soporte</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        {faqItems.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{item.title}</Text>
            <Text style={styles.faqAnswer}>{item.content}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contáctanos</Text>
        
        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL(`tel:${contactInfo.phone}`)}
        >
          <MaterialIcons name="phone" size={24} color="rgb(53,109,79)" />
          <Text style={styles.contactText}>Llamar a Soporte</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL(`mailto:${contactInfo.email}`)}
        >
          <MaterialIcons name="email" size={24} color="rgb(53,109,79)" />
          <Text style={styles.contactText}>Enviar Email</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => Linking.openURL(`whatsapp://send?phone=${contactInfo.whatsapp}`)}
        >
          <MaterialIcons name="message" size={24} color="rgb(53,109,79)" />
          <Text style={styles.contactText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(53,109,79)',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
});