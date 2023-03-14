<template>
  <div id="app" v-if="pokedex" class="container mx-auto">
    <div class="wrapper mt-0 sm:mt-32 sm:px-6">
      <PickerPalette v-if="pokedex.showPalette" />
      <div class="grid grid-cols-1 gap-y-4 xl:grid-cols-2 xl:grid-rows-[auto_1fr] xl:gap-y-12">
          <div class="xl:order-first lg:row-span-2 px-2 mt-8 md:px-8">
            <div class="wrapper px-4">
              <h1 class="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                Not sure how to prep for your next Tera Raid? Let Tera Typer help 🔮
              </h1>
            </div>
            <Header />
          </div>
          <div v-if="pokedex && pokedex.loaded" id="col-2" class="md:px-8 px-2 wrapper flex flex-col mb-80 gap-4">
            <Typing />
          </div>
        </div>
       <MadeBy class="block md:hidden" />
    </div>
  </div>
</template>
<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'

import voca from 'voca'
import Picker from './components/Picker.vue'
import PickerPalette from './components/PickerPalette.vue'
import Moves from './components/Moves.vue'
import Chart from './components/Chart.vue'
import Type from './components/Type.vue'
import Move from './components/Move.vue'
import Header from './components/Header.vue'
import { usePokedexStore } from './stores/pokedex'
import MoveList from './components/MoveList.vue'
import MadeBy from './components/MadeBy.vue'

const pokedex = usePokedexStore()
pokedex.init()

const capitalize = function(text) {
  return voca(text).replaceAll('-', ' ').titleCase()
}
</script>
<style>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

.card {
  @apply w-full py-6 pb-8 bg-gray-900 rounded-lg shadow-lg;
}
</style>