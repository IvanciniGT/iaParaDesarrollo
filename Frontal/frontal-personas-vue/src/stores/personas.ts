import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Persona } from '../models/frontend/persona.model';
import type { NuevaPersona } from '../models/frontend/nueva-persona.model';
import type { ModificarPersona } from '../models/frontend/modificar-persona.model';
import { personasApiRestService } from '../services/personas-api-rest.service';

export const usePersonasStore = defineStore('personas', () => {
  // Estado
  const personas = ref<Persona[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const personasCount = computed(() => personas.value.length);
  const personasOrdenadas = computed(() => 
    [...personas.value].sort((a, b) => a.nombre.localeCompare(b.nombre))
  );

  // Función para obtener persona por ID
  const getPersonaById = computed(() => {
    return (id: string) => personas.value.find(p => p.id === id);
  });

  // Actions
  async function cargarPersonas() {
    isLoading.value = true;
    error.value = null;
    
    try {
      personas.value = await personasApiRestService.getAll();
    } catch (err) {
      error.value = 'Error al cargar las personas';
      console.error('Error cargando personas:', err);
    } finally {
      isLoading.value = false;
    }
  }

  async function obtenerPersona(id: string): Promise<Persona | null> {
    // Primero buscar en el estado local
    const personaLocal = personas.value.find(p => p.id === id);
    if (personaLocal) {
      return personaLocal;
    }

    // Si no está en el estado local, buscar en la API
    try {
      const persona = await personasApiRestService.getById(id);
      
      // Agregar al estado local si no existe
      const index = personas.value.findIndex(p => p.id === id);
      if (index === -1) {
        personas.value.push(persona);
      }
      
      return persona;
    } catch (err) {
      error.value = `Error al obtener la persona con ID ${id}`;
      console.error('Error obteniendo persona:', err);
      return null;
    }
  }

  async function crearPersona(nuevaPersona: NuevaPersona): Promise<Persona | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const personaCreada = await personasApiRestService.create(nuevaPersona);
      
      // Agregar al estado local
      personas.value.push(personaCreada);
      
      return personaCreada;
    } catch (err) {
      error.value = 'Error al crear la persona';
      console.error('Error creando persona:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function actualizarPersona(id: string, datosPersona: ModificarPersona): Promise<Persona | null> {
    isLoading.value = true;
    error.value = null;

    try {
      const personaActualizada = await personasApiRestService.update(id, datosPersona);
      
      // Actualizar en el estado local
      const index = personas.value.findIndex(p => p.id === id);
      if (index !== -1) {
        personas.value[index] = personaActualizada;
      }
      
      return personaActualizada;
    } catch (err) {
      error.value = 'Error al actualizar la persona';
      console.error('Error actualizando persona:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function eliminarPersona(id: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      await personasApiRestService.delete(id);
      
      // Eliminar del estado local
      const index = personas.value.findIndex(p => p.id === id);
      if (index !== -1) {
        personas.value.splice(index, 1);
      }
      
      return true;
    } catch (err) {
      error.value = 'Error al eliminar la persona';
      console.error('Error eliminando persona:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function limpiarError() {
    error.value = null;
  }

  function resetearEstado() {
    personas.value = [];
    isLoading.value = false;
    error.value = null;
  }

  return {
    // Estado
    personas,
    isLoading,
    error,
    
    // Getters
    personasCount,
    personasOrdenadas,
    getPersonaById,
    
    // Actions
    cargarPersonas,
    obtenerPersona,
    crearPersona,
    actualizarPersona,
    eliminarPersona,
    limpiarError,
    resetearEstado
  };
});
