<template>
    <div class="card">
        <h2 class="title">Recommendations</h2>
        <table class="list">
            <thead>
                <tr>
                    <th scope="col">Pokemon</th>
                    <th scope="col">Type</th>
                    <th scope="col">Buff Access</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="pokemon in pokedex.recommendedPokemon" :key="pokemon.id">
                    <td>
                        <div>
                            <img :src="pokemon.sprites.front_default" alt="pokemon.name" class="w-8 h-8"/>
                            <span>{{ capitalize(pokemon.name) }}</span>
                        </div>
                    </td>
                    <td>
                        <div>
                            <Type v-for="pokeType in pokemon.types" :type="pokeType.type.name" />
                        </div>
                    </td>
                    <td>
                        <!-- <span v-if="pokemon.defenseLoweringMoves">⬇️</span>
                        <span v-if="pokemon.attackRaisingMoves">⬆️</span> -->
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { usePokedexStore } from '../stores/pokedex'
import { storeToRefs } from 'pinia'
import { capitalize } from '~~/helpers/capitalize'
import Type from './Type.vue'
const pokedex = usePokedexStore()
pokedex.getListOfRecommendedPokemon()

// This will also create refs for properties added by plugins
// but skip any action or non reactive (non ref/reactive) property
const { typeChart } = storeToRefs(pokedex)

watch(typeChart, () => {
  console.log('types changed', typeChart)
  pokedex.getListOfRecommendedPokemon()
})

</script>
<style scoped>
.list {
    list-style: none;
    padding: 0;
    margin: 0;
    @apply text-white;
    @apply min-w-full divide-y divide-gray-700;
    thead th { @apply px-3 py-3.5 text-left text-gray-400 pl-0; }
    tbody { @apply divide-y divide-gray-700; }
    tbody td { @apply whitespace-nowrap py-4 pr-3 font-mono text-sm; }
    /* @apply flex flex-col gap-3 text-white mt-4; */
    .list-item { @apply grid grid-cols-3 items-center justify-center gap-x-4;}
    div { @apply flex flex-row gap-2 items-center; }
    .list-item button {
        @apply flex flex-row gap-2 justify-start items-center rounded pl-2 pr-3 py-1;
        @apply bg-slate-800;
        &:hover {
            @apply bg-slate-700;
        }
    }
}
</style>