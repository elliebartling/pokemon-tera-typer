<template>
    <div class="card">
        <h2 class="title">Recommendations</h2>
        <div class="list-wrapper">
            <table class="list">
                <thead>
                    <tr>
                        <th scope="col">Pokemon</th>
                        <th scope="col">Type</th>
                        <th scope="col">Stats</th>
                        <th scope="col">⬆️ Stat Increase</th>
                        <th scope="col">⬇️ Stat Decrease</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pokemon in pokedex.recommendedPokemon" :key="pokemon.id">
                        <td class="first">
                            <div class="poke">
                                <img :src="pokemon.sprites.other['official-artwork'].front_default" />
                                <div class="wrapper">
                                    <span class="name">{{ capitalize(pokemon.name) }}</span>
                                    <div class="types" v-if="!smAndLarger">
                                        <Type v-for="pokeType in pokemon.types" :type="pokeType.type.name" />
                                    </div>
                                    <div class="tag">
                                        {{ getPokemonAttackType(pokemon) }} Attacker
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="second-type">
                            <div class="types">
                                <Type v-for="pokeType in pokemon.types" :type="pokeType.type.name" />
                            </div>
                        </td>
                        <td class="third-stats">
                            <div class="stats">
                                <Chart :pokemon="pokemon" :show="[1,2,3,4]" />
                            </div>
                        </td>
                        <td class="buff-moves buff-increase">
                            <div  class="moves text-orange-400" v-if="pokemon.specialMoves.attackRaising.length > 0 && (getPokemonAttackType(pokemon) == 'Physical' || getPokemonAttackType(pokemon) == 'Mixed')">
                                ATK ⬆️
                                <div class="group">
                                    <span v-for="move in pokemon.specialMoves.attackRaising">{{ capitalize(move.name) }}</span>
                                </div>
                            </div>
                            <div  class="moves text-purple-400" v-if="pokemon.specialMoves.specialAttackRaising.length > 0 && (getPokemonAttackType(pokemon) == 'Special' || getPokemonAttackType(pokemon) == 'Mixed')">
                                SPA ⬆️
                                <div class="group">
                                    <span v-for="move in pokemon.specialMoves.specialAttackRaising">{{ capitalize(move.name) }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="buff-moves buff-decrease">
                            <div class="moves text-orange-400" v-if="pokemon.specialMoves.defenseLowering.length > 0 && (getPokemonAttackType(pokemon) == 'Physical' || getPokemonAttackType(pokemon) == 'Mixed')">
                                DEF ⬇️
                                <div class="group">
                                    <span v-for="move in pokemon.specialMoves.defenseLowering">{{ capitalize(move.name) }}</span>
                                </div>
                            </div>
                            <div class="moves text-purple-400" v-if="pokemon.specialMoves.specialDefenseLowering.length > 0 && (getPokemonAttackType(pokemon) == 'Special' || getPokemonAttackType(pokemon) == 'Mixed')">
                                SPD ⬇️
                                <div class="group">
                                    <span v-for="move in pokemon.specialMoves.specialDefenseLowering">{{ capitalize(move.name) }}</span>
                                </div>
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
import MoveList from './MoveList.vue'
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

function getPokemonAttackType(pokemon) {
    if (pokemon.ATKType > 20) { return 'Physical' } else if (pokemon.ATKType < -20) { return 'Special' } else { return 'Mixed' }
}

function getPokemonDefenseType(pokemon) {
    if (pokemon.DEFType > 20) { return 'Physical' } else if (pokemon.DEFType < -20) { return 'Special' } else { return 'Mixed' }
}

// function getDefaultImage() {
//     return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
// }

</script>
<style scoped>
.list-wrapper {
    @apply overflow-x-scroll;
    @apply scroll-px-6 px-6;
    @apply -ml-6 -mr-6;
}
.list {
    list-style: none;
    padding: 0;
    margin: 0;
    @apply text-white;
    @apply min-w-full divide-y divide-gray-700;
    width: calc(100% + 6rem);
    .tag { @apply text-xs inline-block px-1.5 py-1 bg-gray-800 rounded-md mt-0.5 sm:mt-0; }
    .name { @apply font-sans font-bold text-lg; }

    td { vertical-align: top; }

    thead th { @apply px-3 py-3.5 text-left text-gray-400 pl-0; }
    tbody { @apply divide-y divide-gray-700; }
    tbody td { @apply whitespace-nowrap py-4 pr-3 font-mono text-sm; }
    td .poke { @apply flex flex-row gap-2 items-center w-64 sm:w-52; }
    td .poke img { @apply w-14 h-14 sm:w-10 sm:h-10;}
    td .types { @apply flex flex-row gap-2 items-center; }
    td .wrapper { @apply text-gray-300 flex flex-col gap-y-1 justify-start items-start; }
    td .stats { @apply text-xs w-44 !important; }
    /* td .stats .chart { @apply h-1 !important; } */

    .buff-moves { vertical-align: top; }
    td.buff-moves .moves { @apply w-52 flex flex-col gap-y-1 text-xs h-full justify-start items-start mb-2; }
    .buff-moves span { @apply text-gray-300 inline-block px-1 py-0.5 mb-1 rounded bg-zinc-700 text-xs; }
    .buff-moves .group { @apply flex flex-wrap flex-row gap-x-1; }
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