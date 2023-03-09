<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="text-4xl font-bold text-white font-sans">Pokémon Tera Typer</h1>
    <p class="text-xl text-gray-300">Not sure what Pokémon to bring to your next raid? Get a hint:</p>
  </div>
</template>

<style scoped>
</style>
