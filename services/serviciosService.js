import { db } from '../database/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const serviciosIniciales = [
  {
    nombre: 'Masaje Relajante',
    descripcion: 'Un masaje suave y relajante que ayuda a reducir el estrés y la tensión muscular.',
    duracion: 60,
    precio: 600,
    imagenUrl: '../assets/masaje.jpg',
    beneficios: [
      'Reduce el estrés',
      'Mejora la circulación',
      'Alivia dolores musculares',
      'Promueve la relajación profunda'
    ]
  },
  {
    nombre: 'Exfoliación Corporal',
    descripcion: 'Tratamiento que elimina las células muertas y renueva la piel.',
    duracion: 45,
    precio: 500,
    imagenUrl: '../assets/exfoliacion.jpeg',
    beneficios: [
      'Piel más suave',
      'Mejora la textura',
      'Estimula la renovación celular',
      'Prepara la piel para otros tratamientos'
    ]
  }
];

export const inicializarServicios = async () => {
  try {
    const serviciosRef = collection(db, 'servicios');
    const snapshot = await getDocs(serviciosRef);
    
    if (snapshot.empty) {
      for (const servicio of serviciosIniciales) {
        await addDoc(serviciosRef, servicio);
      }
      console.log('Servicios inicializados correctamente');
    }
  } catch (error) {
    console.error('Error al inicializar servicios:', error);
  }
};

export const obtenerServicios = async () => {
  try {
    const serviciosRef = collection(db, 'servicios');
    const snapshot = await getDocs(serviciosRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return [];
  }
};

export const agregarServiciosPrueba = async () => {
  const serviciosPrueba = [
    {
      nombre: 'Masaje Relajante',
      descripcion: 'Masaje suave que ayuda a reducir el estrés y la tensión muscular',
      duracion: 60,
      precio: 800,
      imagenUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2',
      categoria: 'Masajes',
      beneficios: ['Reduce estrés', 'Mejora circulación', 'Alivia dolor muscular']
    },
    {
      nombre: 'Facial Hidratante',
      descripcion: 'Tratamiento facial profundo para hidratar y revitalizar la piel',
      duracion: 45,
      precio: 600,
      imagenUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881',
      categoria: 'Faciales',
      beneficios: ['Hidratación profunda', 'Piel radiante', 'Reduce líneas finas']
    },
    {
      nombre: 'Masaje Deportivo',
      descripcion: 'Masaje intenso para atletas y deportistas',
      duracion: 75,
      precio: 950,
      imagenUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1',
      categoria: 'Masajes',
      beneficios: ['Recuperación muscular', 'Previene lesiones', 'Mejora rendimiento']
    },
    {
      nombre: 'Limpieza Facial Profunda',
      descripcion: 'Limpieza facial completa con extracción y mascarilla',
      duracion: 90,
      precio: 750,
      imagenUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c',
      categoria: 'Faciales',
      beneficios: ['Elimina impurezas', 'Reduce acné', 'Piel limpia']
    },
    {
      nombre: 'Tratamiento Corporal Detox',
      descripcion: 'Tratamiento completo para desintoxicar el cuerpo',
      duracion: 120,
      precio: 1200,
      imagenUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15',
      categoria: 'Corporales',
      beneficios: ['Desintoxicación', 'Reduce celulitis', 'Mejora circulación']
    },
    {
      nombre: 'Masaje de Piedras Calientes',
      descripcion: 'Masaje relajante con piedras volcánicas calientes',
      duracion: 90,
      precio: 1000,
      imagenUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
      categoria: 'Masajes',
      beneficios: ['Relaja músculos', 'Reduce estrés', 'Equilibra energía']
    },
    {
      nombre: 'Facial Anti-edad',
      descripcion: 'Tratamiento facial especializado para combatir signos de envejecimiento',
      duracion: 60,
      precio: 850,
      imagenUrl: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648',
      categoria: 'Faciales',
      beneficios: ['Reduce arrugas', 'Aumenta colágeno', 'Piel más firme']
    },
    {
      nombre: 'Envoltura de Algas',
      descripcion: 'Tratamiento corporal con algas marinas',
      duracion: 75,
      precio: 900,
      imagenUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15',
      categoria: 'Corporales',
      beneficios: ['Hidratación', 'Desintoxicación', 'Reduce medidas']
    },
    {
      nombre: 'Reflexología Podal',
      descripcion: 'Masaje terapéutico en los pies',
      duracion: 45,
      precio: 500,
      imagenUrl: 'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c',
      categoria: 'Masajes',
      beneficios: ['Relaja', 'Mejora circulación', 'Reduce estrés']
    },
    {
      nombre: 'Exfoliación con Sales',
      descripcion: 'Exfoliación corporal con sales del Mar Muerto',
      duracion: 60,
      precio: 700,
      imagenUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef',
      categoria: 'Corporales',
      beneficios: ['Piel suave', 'Elimina células muertas', 'Revitaliza']
    }
  ];

  try {
    for (const servicio of serviciosPrueba) {
      await addDoc(collection(db, 'servicios'), servicio);
    }
    console.log('Servicios de prueba agregados correctamente');
  } catch (error) {
    console.error('Error al agregar servicios de prueba:', error);
  }
};