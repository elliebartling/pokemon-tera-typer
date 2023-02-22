<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import voca from 'voca'
import Picker from './components/Picker.vue'
import Moves from './components/Moves.vue'
import Chart from './components/Chart.vue'
import Type from './components/Type.vue'
import Move from './components/Move.vue'
import { usePokedexStore } from './stores/pokedex'
const pokedex = usePokedexStore()
pokedex.getPokemonSpeciesList()
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
            <div className="mt-6 space-y-8 text-base text-zinc-600 dark:text-zinc-400 bg-gray-900 rounded-xl shadow-lg p-8 w-full">
              <Picker />
              <div id="star-level-picker" class="mb-4 block">
                <label class="block label">Star Level of Raid: <span class="font-mono text-sm text-gray-400">({{ pokedex.selectedStarLevel }} Stars, Level {{ pokedex.pokemonLevel }})</span></label>
                <div class="flex flex-row justify-start items-center">
                  <div v-for="star in pokedex.starRatings" :key="star.stars">
                    <button class="text-white" @click="pokedex.selectedStarLevel = star.stars">
                      <svg v-if="pokedex.selectedStarLevel >= star.stars" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
                        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                      </svg>                    
                      <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 fill-inherit">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>                    
                    </button>
                  </div>
                </div>
              </div>
              <div id="tera-type-picker" class="mb-8">
                <label class="block label">Tera Type:</label>
                <div class="grid gap-4 sm:grid-cols-6 grid-cols-5 grid-rows-3">
                  <div v-for="type in pokedex.types" :key="type.name">
                    <button 
                      @click="pokedex.setTeraType(type)" 
                      class="outline-2 outline-offset-2 outline sm:p-4 p-3 rounded-full block"
                      :class="[pokedex.selectedTeraType.name === type.name ? 'outline-teal-400 opacity-100' : 'opacity-40', `bg-${type.color}`]">
                      <img class="w-8" :src="`/icons/${type.name}.svg`" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-8">
                <button 
                  type="button" 
                  @click="pokedex.setNewPokemon()"
                  class="flex items-center rounded-md border border-transparent bg-violet-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
                  Gimme some strategery
                </button>
              </div>
            </div>
          </div>
          <div v-if="pokedex.loaded" id="col-2" class="md:px-8 px-2 wrapper flex flex-col mb-80 gap-4">
            <div id="selected-pokemon" class="w-full py-6 pb-8 relative flex flex-col bg-gray-900 rounded-lg shadow-lg" v-if="pokedex.selectedPokemon">
              <div class="sm:pl-48 pl-32">
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
              <div class="w-32 sm:w-48 -left-32 sm:-left-36 -top-12 absolute">
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
              <div id="watch-out" class="flex flex-col items-start mt-3">
                <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap">But watch out for moves like...</p>
                <div class="bg-black bg-opacity-20 rounded-xl w-full px-4 md:px-4 pb-3 -ml-8 relative" style="width: calc(100% + 4rem)">
                  <div class="flex flex-col w-full">
                    <div class="flex flex-row w-full text-white font-mono text-xs px-4 py-4 rounded-t-lg">
                      <div class="w-1/3">Name</div>
                      <div class="w-1/6">Type</div>
                      <div class="w-20">Damage</div>
                      <div class="">2x effective vs.</div>
                    </div>
                    <Move 
                      v-for="move in pokedex.watchOutMoves"
                      class="mr-2 mb-2"
                      :key="move.name"
                      :move="move" />
                    </div>
                </div>
              </div>
            </div>
            <div id="all-moves" class="card px-8">
              <h2 class="text-2xl font-bold text-white mb-2">All of {{voca(pokedex.selectedPokemon.name).capitalize()}}'s moves</h2>
              <div class="flex flex-col items-start mt-3">
                <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap">By level</p>
                <div class="bg-black bg-opacity-20 rounded-xl w-full px-4 md:px-4 pb-3 -ml-8 relative" style="width: calc(100% + 4rem)">
                  <div class="flex flex-col w-full">
                    <div class="flex flex-row w-full text-white font-mono text-xs px-4 py-4 rounded-t-lg">
                      <div class="w-1/3">Name</div>
                      <div class="w-1/6">Type</div>
                      <div class="w-20">Damage</div>
                      <div class="">2x effective vs.</div>
                    </div>
                    <Move 
                      v-for="move in pokedex.selectedPokemonMoveset['level-up']"
                      class="mr-2 mb-2"
                      :showLevel="true"
                      :key="move.name"
                      :move="move" />
                    </div>
                </div>
                <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap mt-6">Egg Moves</p>
                <div class="bg-black bg-opacity-20 rounded-xl w-full px-4 md:px-4 pb-3 -ml-8 relative" style="width: calc(100% + 4rem)">
                  <div class="flex flex-col w-full">
                    <div class="flex flex-row w-full text-white font-mono text-xs px-4 py-4 rounded-t-lg">
                      <div class="w-1/3">Name</div>
                      <div class="w-1/6">Type</div>
                      <div class="w-20">Damage</div>
                      <div class="">2x effective vs.</div>
                    </div>
                    <Move 
                      v-for="move in pokedex.selectedPokemonMoveset['egg']"
                      class="mr-2 mb-2"
                      :showLevel="false"
                      :key="move.name"
                      :move="move" />
                    </div>
                </div>
                <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap mt-6">By TM</p>
                <div class="bg-black bg-opacity-20 rounded-xl w-full px-4 md:px-4 pb-3 -ml-8 relative" style="width: calc(100% + 4rem)">
                  <div class="flex flex-col w-full">
                    <div class="flex flex-row w-full text-white font-mono text-xs px-4 py-4 rounded-t-lg">
                      <div class="w-1/3">Name</div>
                      <div class="w-1/6">Type</div>
                      <div class="w-20">Damage</div>
                      <div class="">2x effective vs.</div>
                    </div>
                    <Move 
                      v-for="move in pokedex.selectedPokemonMoveset['machine']"
                      class="mr-2 mb-2"
                      :showLevel="false"
                      :key="move.name"
                      :move="move" />
                    </div>
                </div>
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
