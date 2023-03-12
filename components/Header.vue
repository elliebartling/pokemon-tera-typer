<script setup>
import { mapStores } from 'pinia'
import { usePokedexStore } from '../stores/pokedex'
import StarLevelPicker from './StarLevelPicker.vue'
import Chart from './Chart.vue'
import voca from 'voca'
import { PencilIcon } from '@heroicons/vue/20/solid'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import TeraPicker from './TeraPicker.vue'
import Type from './Type.vue'
import MadeBy from './MadeBy.vue'
import Ability from './Ability.vue'

const pokedex = usePokedexStore()
const capitalize = function(text) {
    return voca(text).replaceAll('-', ' ').titleCase()
}

</script>

<template>
    <div class="relative md:sticky md:top-12 transition-all">
        <div id="pokemon" class="card w-full relative  flex flex-col bg-gray-900 rounded-lg shadow-lg mt-12">
            <div class="flex flex-row">
                <div class="relative flex flex-col order-0 w-1/3 pr-4">
                    <img 
                        v-if="pokedex.loaded"
                        :src="pokedex.selectedPokemon.sprites.other['official-artwork'].front_default"
                        alt=""
                        sizes="(min-width: 1024px) 32rem, 20rem"
                        class="image"
                        />
                    <button v-if="!pokedex.showPalette && pokedex.loaded" class="reset-button">
                        🔀<span class="text-sm block"> Switch Pokémon</span>
                    </button>
                </div>
                <div class="w-2/3 order-1">
                    <h2 
                        @click="pokedex.openPalette()"
                        class="font-sans text-white text-2xl font-bold cursor-pointer flex flex-row gap-x-3 items-center">
                        {{ capitalize(pokedex.loaded ? pokedex.selectedPokemon.name : 'loading...') }}
                    </h2>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center mt-2 mb-1">
                        <div class="flex flex-row">
                            <Type 
                                v-for="type in pokedex.selectedPokemon.types"
                                class="mr-2 mb-2"
                                :type="type.type.name" 
                            />
                        </div>
                    </div>
                    <Chart v-if="pokedex.loaded" class="w-full" />
                </div>
            </div>
            <hr class="mt-6 border-1 border-gray-500 mb-4" />
            <p class="label text-gray-400">Abilities:</p>
            <div id="abilities">
                <Ability v-for="ability in pokedex.selectedPokemon.abilities" :ability="ability" />
            </div>
            <hr class="mt-6 border-1 border-gray-500" />
            <StarLevelPicker class="mt-6 mb-4" />
            <TeraPicker class="mt-2" />
        </div>
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
    @apply grid grid-flow-col;
    @apply gap-y-2 gap-x-2;
    @apply mt-0;
}


.collapsed {
    @apply flex flex-row justify-between items-center gap-7 text-base;
    @apply md:sticky md:top-10 top-0;
}

.reset-button {
    @apply absolute bottom-5 left-1;
    @apply md:left-4 md:-bottom-2;
    @apply lg:bottom-6 lg:-left-5;
    @apply xl:bottom-12 lg:-left-8;
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