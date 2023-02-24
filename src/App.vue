<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import voca from 'voca'
import Picker from './components/Picker.vue'
import Moves from './components/Moves.vue'
import Chart from './components/Chart.vue'
import Type from './components/Type.vue'
import Move from './components/Move.vue'
import Header from './components/Header.vue'
import { usePokedexStore } from './stores/pokedex'
import MoveList from './components/MoveList.vue'
const pokedex = usePokedexStore()
pokedex.getPokemonSpeciesList()
pokedex.getTypes()
</script>

<template>
    <div class="wrapper mt-0 sm:mt-32 sm:px-6">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:order-first lg:row-span-2 px-2 my-8 md:px-8">
            <div class="wrapper px-4">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                Not sure how to prep for your next Tera Raid? Here's a hint!
              </h1>
            </div>
            <Header v-if="pokedex.types"/>
          </div>
          <div v-if="pokedex" id="col-2" class="md:px-8 px-2 wrapper flex flex-col mb-80 gap-4">
            <div id="selected-pokemon" class="card w-full relative flex flex-col bg-gray-900 rounded-lg shadow-lg" v-if="pokedex.selectedPokemon">
              <div class="sm:pl-48 pl-36">
                <h2 class="font-sans text-white text-2xl font-bold">{{ voca(pokedex.selectedPokemon.name).capitalize() }}</h2>
                <div class="flex flex-col sm:flex-row items-start sm:items-center mt-2 mb-4">
                  <p class="label mr-6 text-gray-400">Level {{ pokedex.pokemonLevel }}</p>
                  <div class="flex flex-row">
                    <Type 
                      v-if="pokedex.selectedPokemon" 
                      v-for="type in pokedex.selectedPokemon.types"
                      class="mr-2 mb-2"
                      :type="type.type.name" />
                    </div>
                </div>
              </div>
              <div class="w-32 sm:w-48 -left-28 sm:-left-36 -top-8 absolute">
                <img 
                    v-if="pokedex.selectedPokemon.sprites"
                    :src="pokedex.selectedPokemon.sprites.other['official-artwork'].front_default"
                    alt=""
                    sizes="(min-width: 1024px) 32rem, 20rem"
                    className="aspect-square rotate-6 right-3 mt-4 rounded-2xl object-cover bg-gray-800 ml-28"
                  />
              </div>
              <Chart class="sm:pl-48 pl-8" />
            </div>
            <div id="tactics" class="card px-8">
              <h2 class="text-2xl font-bold text-white mb-2">Your defense</h2>
              <div id="player-defense" class="lex flex-row items-start mt-3">
                <div class="flex flex-col sm:flex-row items-start sm:items-center">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono mt-2 w-36 flex-shrink-0">Defend against:</p>
                  <div class="flex flex-row flex-wrap flex-shrink">
                    <Type 
                    v-if="pokedex.selectedPokemon" 
                    v-for="type in pokedex.selectedPokemon.types"
                    class="mr-2 mb-2"
                    :type="type.type.name" />
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center mt-3">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-36 flex-shrink-0 whitespace-nowrap">Helpful typing:</p>
                  <div class="flex flex-row flex-wrap flex-shrink">
                    <Type 
                      v-for="type in pokedex.selectedPokemonDamageRelations.defense"
                      class="mr-2 mb-2"
                      :key="type.name"
                      :type="type.name" />
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono mt-2 w-36 flex-shrink-0 mt-4">Defense type:</p>
                  <span class="w-5 font-mono text-white text-sm flex flex-row"><img class="w-6 mr-1" :src="`/icons/${pokedex.pokemonPrimaryAttackVector}.png`" />{{ pokedex.pokemonPrimaryAttackVector }}</span>
                </div>
              </div>
              <h2 class="text-2xl font-bold text-white mb-2 mt-8">Your offense</h2>
              <div id="player-offense" class="flex flex-col items-start mt-3">
                <div class="flex flex-col sm:flex-row items-start sm:items-center">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono mt-2 w-36 flex-shrink-0">Attack 2x:</p>
                  <Type 
                    v-if="pokedex.selectedTeraType" 
                    class="mr-2 mb-2"
                    :type="pokedex.selectedTeraType.name"
                  />
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono mt-2 w-36 flex-shrink-0 mt-4">Helpful typing:</p>
                  <div class="flex flex-row flex-wrap flex-shrink">
                    <Type
                      v-if="pokedex.selectedPokemonDamageRelations.offense"
                      v-for="type in pokedex.selectedPokemonDamageRelations.offense"
                      class="mr-2" mb-2
                      :key="type.name"
                      :type="type.name" />
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-start sm:items-center">
                  <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono mt-2 w-36 flex-shrink-0 mt-4">Attack type:</p>
                  <span class="w-5 font-mono text-white text-sm flex flex-row"><img class="w-6 mr-1" :src="`/icons/${pokedex.pokemonPrimaryDefenseVector}.png`" />{{ pokedex.pokemonPrimaryDefenseVector }}</span>
                </div>
              </div>
              <h2 class="text-2xl font-bold text-white mb-2 mt-8">Recommended types</h2>
              <!-- <p class="label text-gray-500">Any overlaps in offensive & defensive typing</p> -->
              <div id="player-overlap" class="items-start mt-3">
                <div class="flex flex-row items-center">
                  <Type 
                    v-if="pokedex.overlappedTyping && pokedex.overlappedTyping.length > 0"
                    v-for="type in pokedex.overlappedTyping" 
                    class="mr-2 mb-2"
                    :type="type.name"
                  />
                  <p v-else class="label text-gray-500">No overlaps :(</p>
                </div>
              </div>
              <div v-if="pokedex.watchOutMoves && pokedex.watchOutMoves.length > 0" id="watch-out" class="flex flex-col items-start mt-3">
                <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap">But watch out for moves like...</p>
                <MoveList :list="pokedex.watchOutMoves" :showLevel="false" />
              </div>
            </div>
            <div id="all-moves" class="card px-8">
              <h2 class="text-2xl font-bold text-white mb-2">All of {{voca(pokedex.selectedPokemon.name).capitalize()}}'s moves</h2>
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
