<template>
    <div id="tera-type-picker">
        <label class="label inline-block">Tera Type:</label>
        <div class="tera-type-picker">
          <div v-for="pokeType in pokedex.types" :key="pokeType.name">
            <button @click="pokedex.setTeraType(pokeType)" 
              class="tera-type"
              :class="[ pokedex.selectedTeraType.name === pokeType.name ? 'tera-type-selected' : 'ring-purple-500/20', `bg-${pokeType.color}`]">
              <img class="w-8" :src="`/icons/${pokeType.name}.png`" />
            </button>
          </div>
        </div>
      </div>
</template>
<script setup>
import { usePokedexStore } from '../stores/pokedex'
const pokedex = usePokedexStore()
</script>
<style scoped>
.label {
    @apply text-white;
}
.tera-type-picker {
    @apply flex flex-row gap-4;
    /* @apply md:grid md:grid-cols-7 md:grid-rows-3; */
    @apply overflow-x-scroll pt-4 px-2;
    @apply snap-x snap-mandatory;
    @apply scroll-px-6;
    @apply -ml-6 px-6 -mr-6;
}
.tera-type {
    @apply w-12 h-12;
    @apply ring ring-4 ring-offset-2;
    @apply rounded-full;
    @apply opacity-70;
    @apply ring-offset-gray-900;
    @apply snap-start;
}

.tera-type img {
    @apply object-cover w-full rounded-full;
}

.tera-type.tera-type-selected {
    @apply ring-purple-500;
    @apply opacity-100;
}
</style>