<script setup>
import { usePokedexStore } from '../stores/pokedex'
import StarLevelPicker from './StarLevelPicker.vue'
import Chart from './Chart.vue'
import voca from 'voca'
import TeraPicker from './TeraPicker.vue'
import Type from './Type.vue'
import MadeBy from './MadeBy.vue'
import Ability from './Ability.vue'
import Moveset from './Moveset.vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const pokedex = usePokedexStore()
const capitalize = function(text) {
    return voca(text).replaceAll('-', ' ').titleCase()
}

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger


</script>

<template>
    <div class="relative transition-all">
        <StarLevelPicker class="card mt-6 mb-4" />
        <TeraPicker class="card mt-2 pb-0" />
        <div id="pokemon" class="card flex flex-col mt-12">
            <div class="flex flex-row">
                <div class="relative flex flex-col order-0 w-1/3 pr-4">
                    <img 
                        v-if="pokedex.loaded"
                        :src="pokedex.selectedPokemon?.sprites.other['official-artwork'].front_default"
                        alt=""
                        sizes="(min-width: 1024px) 32rem, 20rem"
                        class="image"
                        />
                </div>
                <div class="w-2/3 order-1 relative">
                    <h2 
                        @click="pokedex.openPalette()"
                        class="font-sans text-white text-2xl font-bold cursor-pointer flex flex-row gap-x-3 items-center">
                        {{ capitalize(pokedex.loaded ? pokedex.selectedPokemon.name : 'loading...') }}
                    </h2>
                    <button v-if="!pokedex.showPalette && pokedex.loaded" class="reset-button" @click="pokedex.openPalette()">
                        🔀<span class="text-sm block"> Switch</span>
                    </button>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center mt-2 mb-1">
                        <div class="flex flex-row">
                            <Type 
                                v-for="type in pokedex.selectedPokemon.types"
                                class="mr-2 mb-2"
                                :type="type.type.name" 
                            />
                        </div>
                    </div>
                    <Chart v-if="pokedex.loaded && smAndLarger" class="w-full" />
                </div>
            </div>
            <Chart v-if="pokedex.loaded && !smAndLarger" class="w-full" />
            <!-- <hr class="mt-6 border-1 border-gray-500 mb-4" /> -->
            <!-- <p class="text-white font-sans font-bold mb-2 mt-6">Abilities:</p> -->
            <div id="abilities">
                <Ability v-for="ability in pokedex.selectedPokemon.abilities" :ability="ability" />
                <div class="blank w-44 block shrink-0 snap-start h-2"></div>
            </div>
            <!-- <hr class="mt-6 border-1 border-gray-500" /> -->
        </div>
        <Moveset class="mt-4" />
        <!-- <div v-if="pokedex.loaded" id="all-moves" class="card px-8 mt-4">
            <h2 class="text-2xl font-bold text-white mb-2">{{capitalize(pokedex.selectedPokemon.name)}}'s moveset</h2>
            <div class="flex flex-col items-start mt-3">
            <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap">By level</p>
            <MoveList :list="pokedex.selectedPokemonMoveset['level-up']" :showLevel="true" />

            <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap mt-6">Egg Moves</p>
            <MoveList :list="pokedex.selectedPokemonMoveset['egg']" :showLevel="false" />
            
            <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap mt-6">By TM</p>
            <MoveList :list="pokedex.selectedPokemonMoveset['machine']" :showLevel="false" />
            </div>
        </div> -->
        <MadeBy class="hidden md:flex" />
    </div>
</template>

<style scoped>
.image {
    /* Up to first breakpoint */
    @apply w-full aspect-square rounded-2xl object-cover bg-gray-800 mb-4;
    /* Md, rotated */
    @apply md:-left-40 md:-top-16;
    /* Big image, rotated */
    @apply lg:w-48 xl:w-48 lg:-left-36  lg:absolute lg:rotate-6 lg:right-3 lg:mt-4 lg:ml-28;
}

#abilities {
    @apply flex flex-row justify-start items-start;
    @apply overflow-x-scroll overflow-visible;
    @apply gap-y-2 gap-x-2;
    @apply mt-4;
    @apply snap-x;
    @apply -ml-6 px-6 -mr-6;
    @apply scroll-p-4;
}


.collapsed {
    @apply flex flex-row justify-between items-center gap-7 text-base;
    @apply md:sticky md:top-10 top-0;
}

.reset-button {
    @apply absolute -top-10 right-0;
    /* @apply absolute bottom-5 left-1;
    @apply md:left-4 md:-bottom-2;
    @apply lg:bottom-6 lg:-left-5;
    @apply xl:bottom-12 lg:-left-8; */
    @apply flex flex-row items-center gap-x-2;
    @apply font-mono font-medium text-white uppercase px-3 py-2 rounded-xl;
    @apply bg-violet-600 hover:bg-gradient-to-tr from-rose-500 to-blue-400;
    @apply hover:from-purple-500 hover:to-rose-500;
    @apply sm:shadow-xl shadow-purple-500/30;
    @apply hover:rotate-3;
    @apply transition-all;
}

.reset-button .tooltip {
    @apply absolute w-44 z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700;
}
</style>