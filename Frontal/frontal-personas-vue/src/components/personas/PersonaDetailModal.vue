<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Detalles de la Persona</h3>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      
      <div class="modal-body" v-if="persona">
        <div class="detail-row">
          <label>Nombre:</label>
          <span>{{ persona.nombre }}</span>
        </div>
        <div class="detail-row">
          <label>DNI:</label>
          <span>{{ persona.dni }}</span>
        </div>
        <div class="detail-row">
          <label>Email:</label>
          <span>{{ persona.email }}</span>
        </div>
        <div class="detail-row">
          <label>Edad:</label>
          <span>{{ persona.edad }} años</span>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-primary" @click="editarPersona">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-danger" @click="eliminarPersona">
          <i class="fas fa-trash"></i> Eliminar
        </button>
        <button class="btn btn-secondary" @click="closeModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Persona } from '../../models/frontend/persona.model';

// Props
interface Props {
  persona: Persona | null;
  isVisible: boolean;
}

const props = defineProps<Props>();

// Eventos
interface Emits {
  closeModal: [];
  edit: [persona: Persona];
  delete: [persona: Persona];
}

const emit = defineEmits<Emits>();

// Métodos
function closeModal() {
  emit('closeModal');
}

function editarPersona() {
  if (props.persona) {
    emit('edit', props.persona);
  }
}

function eliminarPersona() {
  if (props.persona) {
    emit('delete', props.persona);
  }
}
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

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.detail-row {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.detail-row label {
  font-weight: bold;
  width: 80px;
  color: #555;
}

.detail-row span {
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
}
</style>
