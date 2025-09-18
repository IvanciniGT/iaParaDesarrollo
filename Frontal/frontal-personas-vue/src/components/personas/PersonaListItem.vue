<template>
  <div class="item-container" @click="solicitarVista">
    <div class="persona-info">
      <span class="nombre">{{ persona.nombre }}</span>
      <span class="email">{{ persona.email }}</span>
    </div>
    <div class="acciones">
      <i class="fas fa-edit" @click="solicitarEdicion"></i>
      <i class="fas fa-trash" @click="solicitarBorrado"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Persona } from '../../models/frontend/persona.model';

// Props
interface Props {
  persona: Persona;
}

const props = defineProps<Props>();

// Eventos
interface Emits {
  view: [persona: Persona];
  edit: [persona: Persona];
  delete: [persona: Persona];
}

const emit = defineEmits<Emits>();

// Métodos
function solicitarVista() {
  emit('view', props.persona);
}

function solicitarEdicion(event: Event) {
  event.stopPropagation();
  emit('edit', props.persona);
}

function solicitarBorrado(event: Event) {
  event.stopPropagation();
  emit('delete', props.persona);
}
</script>

<style scoped>
.item-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.item-container:hover {
  background-color: #e9ecef;
}

.persona-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nombre {
  font-weight: bold;
  color: #333;
  font-size: 16px;
}

.email {
  color: #666;
  font-size: 14px;
}

.acciones {
  display: flex;
  gap: 15px;
}

.acciones i {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.fa-edit {
  color: #007bff;
}

.fa-edit:hover {
  background-color: #007bff;
  color: white;
}

.fa-trash {
  color: #dc3545;
}

.fa-trash:hover {
  background-color: #dc3545;
  color: white;
}
</style>
