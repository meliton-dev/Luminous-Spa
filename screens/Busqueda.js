import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { obtenerServicios, agregarServiciosPrueba } from '../services/serviciosService';

const Busqueda = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    categoria: 'todos',
    precio: 'todos',
    fecha: null
  });

  useEffect(() => {
    const cargarServicios = async () => {
      // Descomentar la siguiente línea para agregar los servicios de prueba
       //await agregarServiciosPrueba();
      const serviciosData = await obtenerServicios();
      setServicios(serviciosData);
      setSearchResults(serviciosData);
    };
    cargarServicios();
  }, []);

  // Agregar nuevo estado para el filtro activo
  const [activeFilter, setActiveFilter] = useState('todos');

  // Modificar la función handleSearch para incluir los filtros
  const handleSearch = (text) => {
    setSearchText(text);
    filterResults(text, activeFilter);
  };

  // Nueva función para filtrar resultados
  const filterResults = (text, category) => {
    let results = servicios.filter((item) => {
      const nombre = item.nombre ? item.nombre.toLowerCase() : '';
      const descripcion = item.descripcion ? item.descripcion.toLowerCase() : '';
      const searchTermLower = text.toLowerCase();
      
      return nombre.includes(searchTermLower) || 
             descripcion.includes(searchTermLower);
    });

    if (category !== 'todos') {
      results = results.filter(item => item.categoria === category);
    }

    setSearchResults(results);
  };

  // Modificar la sección de los botones de filtro
  <View style={styles.filterContainer}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <TouchableOpacity 
        style={[
          styles.filterButton,
          activeFilter === 'todos' && styles.activeFilterButton
        ]}
        onPress={() => {
          setActiveFilter('todos');
          filterResults(searchText, 'todos');
        }}
      >
        <Text style={activeFilter === 'todos' ? styles.activeFilterText : null}>
          Todos
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.filterButton,
          activeFilter === 'Masajes' && styles.activeFilterButton
        ]}
        onPress={() => {
          setActiveFilter('Masajes');
          filterResults(searchText, 'Masajes');
        }}
      >
        <Text style={activeFilter === 'Masajes' ? styles.activeFilterText : null}>
          Masajes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.filterButton,
          activeFilter === 'Faciales' && styles.activeFilterButton
        ]}
        onPress={() => {
          setActiveFilter('Faciales');
          filterResults(searchText, 'Faciales');
        }}
      >
        <Text style={activeFilter === 'Faciales' ? styles.activeFilterText : null}>
          Faciales
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.filterButton,
          activeFilter === 'Corporales' && styles.activeFilterButton
        ]}
        onPress={() => {
          setActiveFilter('Corporales');
          filterResults(searchText, 'Corporales');
        }}
      >
        <Text style={activeFilter === 'Corporales' ? styles.activeFilterText : null}>
          Corporales
        </Text>
      </TouchableOpacity>
    </ScrollView>
  </View>

  const sortOptions = [
    { label: 'Precio: Menor a Mayor', value: 'precio-asc' },
    { label: 'Precio: Mayor a Menor', value: 'precio-desc' },
    { label: 'Más Populares', value: 'popular' },
    { label: 'Más Recientes', value: 'fecha' }
  ];

  const showSuggestions = (text) => {
    if (text.length > 2) {
      const matches = servicios.filter(item => {
        return item.nombre && item.nombre.toLowerCase().startsWith(text.toLowerCase());
      }).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => navigation.navigate('NuevaCita', { servicio: item })}
    >
      <Image source={{ uri: item.imagenUrl }} style={styles.image} />
      <View>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={styles.precio}>Precio: ${item.precio}</Text>
        <Text style={styles.duracion}>Duración: {item.duracion} min</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar reservas o servicios..."
        value={searchText}
        onChangeText={(text) => {
          handleSearch(text);
          showSuggestions(text);
        }}
      />
      
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion) => (
            <TouchableOpacity 
              key={suggestion.id}
              style={styles.suggestionItem}
              onPress={() => {
                setSearchText(suggestion.nombre);
                handleSearch(suggestion.nombre);
                setSuggestions([]);
              }}
            >
              <Text style={styles.suggestionText}>{suggestion.nombre}</Text>
              <Text style={styles.suggestionPrice}>${suggestion.precio}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              activeFilter === 'todos' && styles.activeFilterButton
            ]}
            onPress={() => {
              setActiveFilter('todos');
              filterResults(searchText, 'todos');
            }}
          >
            <Text style={[
              styles.filterText,
              activeFilter === 'todos' && styles.activeFilterText
            ]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              activeFilter === 'Masajes' && styles.activeFilterButton
            ]}
            onPress={() => {
              setActiveFilter('Masajes');
              filterResults(searchText, 'Masajes');
            }}
          >
            <Text style={[
              styles.filterText,
              activeFilter === 'Masajes' && styles.activeFilterText
            ]}>
              Masajes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              activeFilter === 'Faciales' && styles.activeFilterButton
            ]}
            onPress={() => {
              setActiveFilter('Faciales');
              filterResults(searchText, 'Faciales');
            }}
          >
            <Text style={[
              styles.filterText,
              activeFilter === 'Faciales' && styles.activeFilterText
            ]}>
              Faciales
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              activeFilter === 'Corporales' && styles.activeFilterButton
            ]}
            onPress={() => {
              setActiveFilter('Corporales');
              filterResults(searchText, 'Corporales');
            }}
          >
            <Text style={[
              styles.filterText,
              activeFilter === 'Corporales' && styles.activeFilterText
            ]}>
              Corporales
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        style={styles.flatList}
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 48,
    borderWidth: 0,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
    elevation: 2,
  },
  flatList: {
    flexGrow: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
  },
  ubicacion: {
    fontSize: 14,
    color: '#757575',
  },
  fecha: {
    fontSize: 14,
    color: '#757575',
  },
  descripcion: {
      fontSize: 12,
      color: '#757575'
  },
  filterContainer: {
    marginVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: 'rgb(53,109,79)',
  },
  activeFilterText: {
    color: 'white',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  suggestionPrice: {
    fontSize: 14,
    color: 'rgb(53,109,79)',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Busqueda;




