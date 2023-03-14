<template>
    <div v-if="loaded" id="all-moves" class="card px-8">
        <h2 class="header text-2xl font-bold text-white flex flex-row justify-start items-center" @click="this.expanded = !this.expanded">
            <svg v-if="!expanded" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 stroke-1">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 stroke-1">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
            {{capitalize(selectedPokemon.name)}}'s full moveset
        </h2>
        <div v-if="expanded" class="flex flex-col items-start mt-6">
            <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap">By level</p>
            <MoveList :list="selectedPokemonMoveset['level-up']" :showLevel="true" />

            <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap mt-6">Egg Moves</p>
            <MoveList :list="selectedPokemonMoveset['egg']" :showLevel="false" />
            
            <p class="text-sm font-medium mb-3 mr-4 text-gray-300 font-mono inline-block w-64 flex-shrink-0 whitespace-nowrap mt-6">By TM</p>
            <MoveList :list="selectedPokemonMoveset['machine']" :showLevel="false" />
        </div>
    </div>
</template>
<script>
import { mapState } from 'pinia'
import { usePokedexStore } from '../stores/pokedex'
import voca from "voca"

function capitalize(text) {
    return voca(text).replaceAll('-', ' ').titleCase()
}

export default {
    data() {
        return {
            expanded: false,
        }
    },
    computed: {
        ...mapState(usePokedexStore, ['selectedPokemonMoveset', 'selectedPokemon', 'loaded']),
    },
    methods: {
        capitalize,
    },
}
</script>
<style scoped>
#all-moves svg {
    @apply stroke-current text-white;
    @apply transition-transform duration-300;
}

#all-moves .header {
    @apply cursor-pointer;
    @apply -ml-2 -mb-2;
}
</style>