<template>
  <div v-if="isVisible" class="modal-overlay" @click="onOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Nueva Persona</h2>
        <i class="fas fa-times close-button" @click="cerrarModal"></i>
      </div>
      
      <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
        <div class="modal-body">
          <div v-if="error" class="error-message">{{ error }}</div>
          
          <div class="form-group">
            <label for="nombre">Nombre *</label>
            <Field 
              name="nombre" 
              type="text" 
              id="nombre"
              class="form-control"
              :class="{ error: errors.nombre }"
              placeholder="Ingrese el nombre completo"
            />
            <span v-if="errors.nombre" class="field-error">{{ errors.nombre }}</span>
          </div>
          
          <div class="form-group">
            <label for="dni">DNI *</label>
            <Field 
              name="dni" 
              type="text" 
              id="dni"
              class="form-control"
              :class="{ error: errors.dni }"
              placeholder="Ej: 12345678A"
            />
            <span v-if="errors.dni" class="field-error">{{ errors.dni }}</span>
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <Field 
              name="email" 
              type="email" 
              id="email"
              class="form-control"
              :class="{ error: errors.email }"
              placeholder="ejemplo@correo.com"
            />
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>
          
          <div class="form-group">
            <label for="edad">Edad *</label>
            <Field 
              name="edad" 
              type="number" 
              id="edad"
              class="form-control"
              :class="{ error: errors.edad }"
              placeholder="Edad en años"
              min="1"
              max="119"
            />
            <span v-if="errors.edad" class="field-error">{{ errors.edad }}</span>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cerrarModal">
            Cancelar
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isSubmitting || isLoading"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            {{ isLoading ? 'Creando...' : 'Crear Persona' }}
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Form, Field } from 'vee-validate';
import * as yup from 'yup';
import { usePersonasStore } from '../../stores/personas';
import type { NuevaPersona } from '../../models/frontend/nueva-persona.model';

// Props
interface Props {
  isVisible: boolean;
}

const props = defineProps<Props>();

// Eventos
interface Emits {
  closeModal: [];
  personaCreated: [];
}

const emit = defineEmits<Emits>();

// Store
const personasStore = usePersonasStore();

// Estado local
const isLoading = ref(false);
const error = ref<string | null>(null);

// Esquema de validación con Yup
const schema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  dni: yup
    .string()
    .required('El DNI es requerido')
    .matches(/^\d{8}[A-Za-z]$/, 'El DNI debe tener 8 dígitos seguidos de una letra'),
  email: yup
    .string()
    .required('El email es requerido')
    .email('Debe ser un formato de email válido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  edad: yup
    .number()
    .required('La edad es requerida')
    .integer('La edad debe ser un número entero')
    .min(1, 'La edad debe ser mayor a 0')
    .max(119, 'La edad debe ser menor a 120')
});

// Métodos
function cerrarModal() {
  error.value = null;
  emit('closeModal');
}

function onOverlayClick(event: Event) {
  if (event.target === event.currentTarget) {
    cerrarModal();
  }
}

async function onSubmit(values: any, { resetForm }: any) {
  isLoading.value = true;
  error.value = null;
  
  try {
    const nuevaPersona: NuevaPersona = {
      nombre: values.nombre,
      dni: values.dni,
      email: values.email,
      edad: Number(values.edad)
    };
    
    const personaCreada = await personasStore.crearPersona(nuevaPersona);
    
    if (personaCreada) {
      resetForm();
      emit('personaCreated');
    } else {
      error.value = 'Error al crear la persona';
    }
  } catch (err) {
    error.value = 'Error al crear la persona';
    console.error('Error creando persona:', err);
  } finally {
    isLoading.value = false;
  }
}

// Limpiar error cuando se cierra el modal
watch(() => props.isVisible, (newValue) => {
  if (!newValue) {
    error.value = null;
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  min-width: 500px;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-button {
  cursor: pointer;
  color: #666;
  font-size: 20px;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-control.error {
  border-color: #dc3545;
}

.field-error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.fa-spinner {
  margin-right: 5px;
}
</style>
