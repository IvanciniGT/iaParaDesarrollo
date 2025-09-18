<template>
  <div class="personas-container">
    <div class="header">
      <h1>Lista de Personas</h1>
      <button class="btn btn-primary" @click="mostrarModalNuevaPersona">
        <i class="fas fa-plus"></i> Nueva Persona
      </button>
    </div>
    
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Cargando personas...
    </div>
    
    <div v-else-if="error" class="error">
      Error: {{ error }}
    </div>
    
    <div v-else-if="personas.length === 0" class="empty-state">
      No hay personas registradas
    </div>
    
    <div v-else class="personas-list">
      <PersonaListItem 
        v-for="persona in personas" 
        :key="persona.id"
        :persona="persona"
        @edit="editarPersona"
        @delete="eliminarPersona"
        @view="verDetallePersona"
      />
    </div>
    
    <!-- Modal de detalle -->
    <PersonaDetailModal
      :persona="personaSeleccionada"
      :is-visible="mostrarModalDetalle"
      @close-modal="cerrarModalDetalle"
      @edit-persona="editarPersonaDesdeDetalle"
      @delete-persona="eliminarPersonaDesdeDetalle"
    />
    
    <!-- Modal de edición -->
    <PersonaEditModal
      :persona="personaParaEditar"
      :is-visible="mostrarModalEdicion"
      @close-modal="cerrarModalEdicion"
      @persona-updated="onPersonaActualizada"
    />
    
    <!-- Modal de creación -->
    <PersonaCreateModal
      :is-visible="mostrarModalCreacion"
      @close-modal="cerrarModalCreacion"
      @persona-created="onPersonaCreada"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePersonasStore } from '../../stores/personas';
import PersonaListItem from './PersonaListItem.vue';
import PersonaDetailModal from './PersonaDetailModal.vue';
import PersonaEditModal from './PersonaEditModal.vue';
import PersonaCreateModal from './PersonaCreateModal.vue';
import type { Persona } from '../../models/frontend/persona.model';

// Store
const personasStore = usePersonasStore();

// Estado de la carga inicial
const isLoading = ref(false);
const error = ref<string | null>(null);

// Estado de los modales
const mostrarModalDetalle = ref(false);
const mostrarModalEdicion = ref(false);
const mostrarModalCreacion = ref(false);
const personaSeleccionada = ref<Persona | null>(null);
const personaParaEditar = ref<Persona | null>(null);

// Computed desde el store
const personas = computed(() => personasStore.personas);

// Funciones de carga inicial
async function cargarPersonas() {
  isLoading.value = true;
  error.value = null;
  
  try {
    await personasStore.cargarPersonas();
  } catch (err) {
    error.value = 'Error al cargar las personas';
    console.error('Error cargando personas:', err);
  } finally {
    isLoading.value = false;
  }
}

// Funciones de modales
function mostrarModalNuevaPersona() {
  mostrarModalCreacion.value = true;
}

function verDetallePersona(persona: Persona) {
  personaSeleccionada.value = persona;
  mostrarModalDetalle.value = true;
}

function editarPersona(persona: Persona) {
  personaParaEditar.value = persona;
  mostrarModalEdicion.value = true;
}

function editarPersonaDesdeDetalle(persona: Persona) {
  mostrarModalDetalle.value = false;
  personaParaEditar.value = persona;
  mostrarModalEdicion.value = true;
}

async function eliminarPersona(persona: Persona) {
  if (confirm(`¿Está seguro de que desea eliminar a ${persona.nombre}?`)) {
    try {
      await personasStore.eliminarPersona(persona.id);
    } catch (err) {
      console.error('Error eliminando persona:', err);
      alert('Error al eliminar la persona');
    }
  }
}

async function eliminarPersonaDesdeDetalle(persona: Persona) {
  mostrarModalDetalle.value = false;
  await eliminarPersona(persona);
}

// Funciones de cierre de modales
function cerrarModalDetalle() {
  mostrarModalDetalle.value = false;
  personaSeleccionada.value = null;
}

function cerrarModalEdicion() {
  mostrarModalEdicion.value = false;
  personaParaEditar.value = null;
}

function cerrarModalCreacion() {
  mostrarModalCreacion.value = false;
}

// Callbacks de modales
function onPersonaActualizada() {
  cerrarModalEdicion();
  // La lista se actualiza automáticamente por la reactividad de Pinia
}

function onPersonaCreada() {
  cerrarModalCreacion();
  // La lista se actualiza automáticamente por la reactividad de Pinia
}

// Carga inicial
onMounted(() => {
  cargarPersonas();
});
</script>

<style scoped>
.personas-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
  margin-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

.personas-list {
  display: grid;
  gap: 15px;
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
