<template>
    <div class="card">
        <h2 class="title">Recommendations</h2>
        <div class="w-ful overflow-x-scroll">
            <table class="list">
                <thead>
                    <tr>
                        <th scope="col">Pokemon</th>
                        <th v-if="smAndLarger" scope="col">Type</th>
                        <th scope="col">Buff Access</th>
                        <th scope="col">Attack type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pokemon in pokedex.recommendedPokemon" :key="pokemon.id">
                        <td>
                            <div class="poke">
                                <img :src="pokemon.sprites.front_default" alt="pokemon.name"/>
                                <div class="wrapper">
                                    <span class="name">{{ capitalize(pokemon.name) }}</span>
                                    <div class="types" v-if="!smAndLarger">
                                        <Type v-for="pokeType in pokemon.types" :type="pokeType.type.name" />
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td v-if="smAndLarger">
                            <div>
                                <Type v-for="pokeType in pokemon.types" :type="pokeType.type.name" />
                            </div>
                        </td>
                        <td>
                            <!-- <span v-for="move in pokemon.specialMoves.attackRaising">{{ move.name }}</span>
                            <span v-for="move in pokemon.specialMoves.specialAttackRaising">{{ move.name }}</span>
                            <span v-for="move in pokemon.specialMoves.defenseLowering">{{ move.name }}</span>
                            <span v-for="move in pokemon.specialMoves.specialDefenseLowering">{{ move.name }}</span> -->
                        </td>
                        <td>
                            <div class="tag">
                            Physical Attacker
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
import { usePokedexStore } from '../stores/pokedex'
import { storeToRefs } from 'pinia'
import { capitalize } from '~~/helpers/capitalize'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import Type from './Type.vue'
const pokedex = usePokedexStore()
pokedex.getListOfRecommendedPokemon()

const breakpoints = useBreakpoints(breakpointsTailwind)
const smAndLarger = breakpoints.greaterOrEqual('md') // sm and larger


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
    @apply overflow-x-scroll;
    thead th { @apply px-3 py-3.5 text-left text-gray-400 pl-0; }
    tbody { @apply divide-y divide-gray-700; }
    tbody td { @apply whitespace-nowrap py-4 pr-3 font-mono text-sm; }
    td .poke { @apply flex flex-row gap-2 items-center w-52; }
    td .poke img { @apply w-10 h-10;}
    td .types { @apply flex flex-row gap-2 items-center; }
    td .wrapper { @apply text-gray-300 flex flex-col gap-y-1; }
    /* @apply flex flex-col gap-3 text-white mt-4; */
    .list-item { @apply grid grid-cols-3 items-center justify-center gap-x-4;}
    /* div { @apply flex flex-row gap-2 items-center; } */
    .list-item button {
        @apply flex flex-row gap-2 justify-start items-center rounded pl-2 pr-3 py-1;
        @apply bg-slate-800;
        &:hover {
            @apply bg-slate-700;
        }
    }
}
</style>