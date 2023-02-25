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
pokedex.getPokemonSpeciesList()
pokedex.getTypes()
pokedex.setSelectedPokemon(pokedex.query)
const capitalize = function(text) {
  return voca(text).replaceAll('-', ' ').titleCase()
}
</script>

<template>
    <div class="wrapper mt-0 sm:mt-32 sm:px-6">
      <PickerPalette v-if="pokedex.showPalette" />

      <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:order-first lg:row-span-2 px-2 mt-8 md:px-8">
            <div class="wrapper px-4">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                Not sure how to prep for your next Tera Raid? Let Tera Typer help 🔮
              </h1>
            </div>
            <Header />
          </div>
          <div v-if="pokedex" id="col-2" class="md:px-8 px-2 wrapper flex flex-col mb-80 gap-4">
            <div v-if="pokedex.loaded" id="tactics" class="card px-8">
              <div id="player-defense" class="lex flex-row items-start mt-3">
                <div class="flex flex-row gap-x-2 sm:flex-row items-center">
                  <h2 class="text-2xl font-bold text-white mb-2">🏰 Defense</h2>
                  <div class="flex flex-row items-baseline gap-x-1">
                    <p class="text-xs font-medium mb-3 text-gray-300 font-mono mt-2">vs.</p>
                    <div class="flex flex-row flex-wrap flex-shrink">
                      <Type 
                      v-if="pokedex.selectedPokemon" 
                      v-for="type in pokedex.selectedPokemon.types"
                      class="mr-2 mb-2"
                      :type="type.type.name" />
                    </div>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center mt-3">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-36 flex-shrink-0 whitespace-nowrap">✨ Resisted by:</p>
                  <div class="flex flex-row flex-wrap flex-shrink">
                    <Type 
                      v-for="type in pokedex.selectedPokemonDamageRelations.defense.resist"
                      class="mr-2 mb-2"
                      :key="type.name"
                      :type="type.name" />
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-start mt-3">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-36 flex-shrink-0 whitespace-nowrap">👍 Neutral:</p>
                  <div class="flex flex-row flex-wrap flex-shrink">
                    <Type 
                      v-for="type in pokedex.selectedPokemonDamageRelations.defense.neutral"
                      class="mr-2 mb-2"
                      :key="type.name"
                      :type="type.name" />
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono mt-2 w-36 flex-shrink-0 mt-4">🥊 Class:</p>
                  <span class="font-mono rounded-md text-white text-xs inline-flex flex-row bg-slate-700 px-2 py-1">
                    <img class="w-6 mr-1" v-if="pokedex.pokemonPrimaryAttackVector != 'either'" :src="`/icons/${pokedex.pokemonPrimaryAttackVector}.png`" />{{ pokedex.pokemonPrimaryAttackVector }}
                  </span>
                </div>
              </div>
              <hr class="border-1 border-gray-500 mt-8" />
              <div id="player-offense" class="flex flex-col items-start mt-8">
                <div class="flex flex-row gap-x-2 sm:flex-row items-center">
                  <h2 class="text-2xl font-bold text-white mb-2">⚔️ Offense</h2>
                  <div class="flex flex-row items-baseline gap-x-1">
                    <p class="text-xs font-medium mb-3 text-gray-300 font-mono mt-2">vs.</p>
                    <div class="flex flex-row flex-wrap flex-shrink">
                      <Type 
                      v-if="pokedex.selectedTeraType" 
                      class="mr-2 mb-2"
                      :type="pokedex.selectedTeraType.name" />
                    </div>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono mt-2 w-36 flex-shrink-0 mt-4">💥 2x effective:</p>
                  <div class="flex flex-row flex-wrap flex-shrink">
                    <Type
                      v-if="pokedex.selectedPokemonDamageRelations.offense"
                      v-for="type in pokedex.selectedPokemonDamageRelations.offense"
                      class="mr-2" mb-2
                      :key="type.name"
                      :type="type.name" />
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center ">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono mt-2 w-36 flex-shrink-0 mt-4">🥊 Class:</p>
                  <span class="font-mono rounded-md text-white text-xs inline-flex flex-row bg-slate-700 px-2 py-1">
                    <img class="w-6 mr-1" v-if="pokedex.pokemonPrimaryDefenseVector != 'either'" :src="`/icons/${pokedex.pokemonPrimaryDefenseVector}.png`" />{{ pokedex.pokemonPrimaryDefenseVector }}
                  </span>
                </div>
              </div>
              <hr class="border-1 border-gray-500 mt-8" />
              <h2 class="text-2xl font-bold text-white mb-2 mt-8">🪄 Recommendations</h2>
              <p class="label text-white">🏆 Resisted defense & super effective offense: </p>
              <div id="player-overlap" class="items-start mt-3">
                <div class="flex flex-row items-center">
                  <Type 
                    v-if="pokedex.resistedOverlappedTyping && pokedex.resistedOverlappedTyping.length > 0"
                    v-for="type in pokedex.resistedOverlappedTyping" 
                    class="mr-2 mb-2"
                    :type="type.name"
                  />
                  <p v-else class="label text-gray-500">No overlaps. Use your best judgement! ✨ </p>
                </div>
              </div>
              <p class="label text-white mt-4">💪 Neutral defense & super effective offense: </p>
              <div id="player-overlap" class="items-start mt-3">
                <div class="flex flex-row items-center">
                  <Type 
                    v-if="pokedex.neutralOverlappedTyping && pokedex.neutralOverlappedTyping.length > 0"
                    v-for="type in pokedex.neutralOverlappedTyping" 
                    class="mr-2 mb-2"
                    :type="type.name"
                  />
                  <p v-else class="label text-gray-500">No overlaps. Use your best judgement! ✨ </p>
                </div>
              </div>
              <div v-if="pokedex.watchOutMoves && pokedex.watchOutMoves.length > 0" id="watch-out" class="flex flex-col items-start mt-3">
                <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap">But watch out for moves like...</p>
                <MoveList :list="pokedex.watchOutMoves" :showLevel="false" />
              </div>
            </div>
            <div v-if="pokedex.loaded" id="all-moves" class="card px-8">
              <h2 class="text-2xl font-bold text-white mb-2">{{capitalize(pokedex.selectedPokemon.name)}}'s moveset</h2>
              <div class="flex flex-col items-start mt-3">
                <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap">By level</p>
                <MoveList :list="pokedex.selectedPokemonMoveset['level-up']" :showLevel="true" />

                <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap mt-6">Egg Moves</p>
                <MoveList :list="pokedex.selectedPokemonMoveset['egg']" :showLevel="false" />
                
                <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap mt-6">By TM</p>
                <MoveList :list="pokedex.selectedPokemonMoveset['machine']" :showLevel="false" />
              </div>
            </div>
          </div>
        </div>
       <MadeBy class="block md:hidden" />
    </div>
</template>

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
