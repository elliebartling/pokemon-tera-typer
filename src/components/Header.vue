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

const pokedex = usePokedexStore()
const capitalize = function(text) {
    return voca(text).replaceAll('-', ' ').titleCase()
}

</script>

<template>
    <div class="relative md:sticky md:top-48">
        <div id="pokemon" class="card w-full relative md:sticky md:top-48 flex flex-col bg-gray-900 rounded-lg shadow-lg mt-12">
            <div class="sm:pl-48 pl-36">
                <h2 
                    @click="pokedex.openPalette()"
                    class="font-sans text-white text-2xl font-bold cursor-pointer flex flex-row gap-x-3 items-center">
                    {{ capitalize(pokedex.loaded ? pokedex.selectedPokemon.name : 'loading...') }}
                    <PencilSquareIcon v-if="!pokedex.showPalette && pokedex.loaded" class="w-6" />
                </h2>
                <div class="flex flex-col sm:flex-row items-start sm:items-center mt-2 mb-4">
                    <div class="flex flex-row">
                        <Type 
                            v-for="type in pokedex.selectedPokemon.types"
                            class="mr-2 mb-2"
                            :type="type.type.name" 
                        />
                    </div>
                </div>
            </div>
            <div class="w-32 sm:w-48 -left-24 sm:-left-36 -top-0 absolute">
                <img 
                    v-if="pokedex.loaded"
                    :src="pokedex.selectedPokemon.sprites.other['official-artwork'].front_default"
                    alt=""
                    sizes="(min-width: 1024px) 32rem, 20rem"
                    className="aspect-square sm:rotate-6 right-3 mt-4 rounded-2xl object-cover bg-gray-800 ml-28"
                    />
            </div>
            <Chart v-if="pokedex.loaded" class="pl-36 sm:pl-48" />
            <hr class="mt-6 border-1 border-gray-500" />
            <StarLevelPicker class="mt-6 mb-4" />
            <TeraPicker class="mt-2" />
        </div>
        <div class="about hidden md:flex gap-x-6 mt-7 ml-4 ">
            <span class="font-mono text-sm text-white font-semibold">Made with 🖤 and 🌮 by elliemb</span>
            <span class="font-mono text-sm text-white font-semibold">Powered by PokeAPI</span>
        </div>
    </div>
</template>

<style scoped>


.collapsed {
    @apply flex flex-row justify-between items-center gap-7 text-base;
    @apply md:sticky md:top-10 top-0;
}
</style>