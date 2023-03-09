<script setup>
    import { usePokedexStore } from '../stores/pokedex'
    const pokedex = usePokedexStore()
    const labels = ['HP ', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE']
</script>

<template>
    <div id="chart" class="w-full">
        <template v-for="(stat, index) in pokedex.selectedPokemon.stats">
            <div class="flex flex-row items-center font-mono w-full">
                <span class="stat text-sm mr-2 text-white w-10">{{ labels[index] }}</span>
                <span class="val text-sm mr-2 text-slate-500 w-10">{{ stat.base_stat }}</span>
                <span class="w-full">
                    <span class="bg-gradient-to-r from-violet-700 via-purple-600 to-rose-400 rounded-full block h-1.5" :style="`width: ${stat.base_stat / 150 * 100}%`"></span>
                </span>
                
            </div>
        </template>
    </div>
</template>
