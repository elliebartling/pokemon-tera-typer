<template>
    <div id="typing" class="card">
        <h2 class="title">Typing</h2>
        <div id="type-chart" class="type-chart-outer">
            <div class="header defense w-full">
                <div class="row">
                    <label>🏰 Defense vs.</label>
                    <Type 
                        v-if="pokedex.selectedPokemon" 
                        v-for="type in pokedex.selectedPokemon.types"
                        class="mr-2 mb-2"
                        :type="type.type.name" 
                    />
                </div>
                <div class="row table-header">
                    <div class="">Super Resist</div>
                    <div class="">Neutral Resist</div>
                </div>
            </div>
            <div class="header offense w-64">
                <div class="row">
                    <label>⚔️ Offense vs.</label>
                    <Type 
                        v-if="pokedex.selectedTeraType" 
                        class="mr-2 mb-2"
                        :type="pokedex.selectedTeraType.name" 
                    />
                </div>
                <div class="row table-header">
                    <div class="">Neutral</div>
                    <div class="">Super</div>
                </div>
            </div>
            <table class="type-chart-inner">
                <tr class="offense-super">
                    <td>
                        <Type 
                            v-for="type in pokedex.typeChart.quadrants.quad1"
                            class="mr-2 mb-2"
                            :type="type.name" 
                        />
                    </td>
                    <td><Type 
                            v-for="type in pokedex.typeChart.quadrants.quad2"
                            class="mr-2 mb-2"
                            :type="type.name" 
                        /></td>
                </tr>
                <tr class="offense-neutral">
                    <td><Type 
                            v-for="type in pokedex.typeChart.quadrants.quad3"
                            class="mr-2 mb-2"
                            :type="type.name" 
                        /></td>
                    <td><Type 
                            v-for="type in pokedex.typeChart.quadrants.quad4"
                            class="mr-2 mb-2"
                            :type="type.name" 
                        /></td>
                </tr>
            </table>
        </div>
        <div class="beware">
            <p>Don't use: </p>
            <Type 
                v-for="type in pokedex.typeChart.quadrants.quad5"
                class="mr-2 mb-2"
                :type="type.name" 
            />
        </div>
    </div>
</template>
<script setup>
import { usePokedexStore } from '../stores/pokedex'
const pokedex = usePokedexStore()
</script>
<style scoped>
#type-chart {
    @apply w-full relative h-80 pl-14;
}
.header { 
    @apply text-sm text-gray-500 font-mono; 
    @apply flex flex-col justify-center items-center gap-x-1;
}

.header .row { @apply flex flex-row justify-center items-baseline gap-x-1 w-full; }

.header .row.table-header { 
    @apply text-xs grid grid-cols-2 w-full text-center text-white; 
    @apply bg-gradient-to-r from-violet-500 to-rose-400/0 py-2 rounded-t-md;
}

.header.offense {
    @apply -rotate-90 -left-2 absolute top-80;
    transform-origin: top left;
}

.header.offense .row.row.table-header {
    @apply bg-gradient-to-l;
}

.type-chart-inner {
    @apply w-full text-white text-xs font-mono;
    tr { @apply h-32; }
    td { @apply border border-gray-700 w-1/2 p-2 align-top; }
}

.beware {
    @apply text-xs text-gray-500 font-mono;
    @apply flex flex-row justify-start items-baseline gap-x-1;
    @apply pt-8;
}
</style>