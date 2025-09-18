<script setup lang="ts">
import PersonaList from './components/personas/PersonaList.vue';
</script>

<template>
  <div id="app">
    <header>
      <h1>Gestión de Personas - Vue.js</h1>
    </header>
    <main>
      <PersonaList />
    </main>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

header {
  background-color: #343a40;
  color: white;
  padding: 20px;
  text-align: center;
}

header h1 {
  margin: 0;
}

main {
  padding: 20px;
}
</style>
