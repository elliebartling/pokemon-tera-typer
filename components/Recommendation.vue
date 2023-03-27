<template>
    <div class="card">
        <h2 class="title">Recommendations</h2>
        <div class="w-full overflow-x-scroll">
            <table class="list">
                <thead>
                    <tr>
                        <th scope="col">Pokemon</th>
                        <th v-if="smAndLarger" scope="col">Type</th>
                        <th scope="col">Buff Moves</th>
                        <th scope="col">Attack type</th>
                        <th scope="col">Defense type</th>
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
                        <td id="buff-moves">
                            <div  class="group text-xs text-indigo-400 flex items-baseline gap-x-1" v-if="getPokemonAttackType(pokemon) == 'Physical' || getPokemonAttackType(pokemon) == 'Mixed'">
                                ATK ⬆️
                                <span v-for="move in pokemon.specialMoves.attackRaising">{{ capitalize(move.name) }}</span>
                            </div>
                            <div  class="group text-xs text-indigo-400 flex items-baseline gap-x-1" v-if="getPokemonAttackType(pokemon) == 'Special' || getPokemonAttackType(pokemon) == 'Mixed'">
                                SPA ⬆️
                                <span v-for="move in pokemon.specialMoves.specialAttackRaising">{{ capitalize(move.name) }}</span>
                            </div>
                            <div class="group text-xs text-rose-400 flex items-baseline gap-x-1" v-if="pokemon.specialMoves.defenseLowering.length > 0 && (getPokemonAttackType(pokemon) == 'Physical' || getPokemonAttackType(pokemon) == 'Mixed')">
                                DEF ⬇️
                                <span v-for="move in pokemon.specialMoves.defenseLowering">{{ capitalize(move.name) }}</span>
                            </div>
                            <div class="group text-xs text-rose-400 flex items-baseline gap-x-1" v-if="pokemon.specialMoves.specialDefenseLowering.length > 0 && (getPokemonAttackType(pokemon) == 'Special' || getPokemonAttackType(pokemon) == 'Mixed')">
                                SPD ⬇️
                                <span v-for="move in pokemon.specialMoves.specialDefenseLowering">{{ capitalize(move.name) }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="tag">
                                {{ getPokemonAttackType(pokemon) }}
                            </div>
                        </td>
                        <td>
                            <div class="tag">
                                {{ getPokemonDefenseType(pokemon) }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="w-full">
            <h2 class="title mt-6 mb-2">But watch out for...</h2>
            <p class="text-xs font-mono text-gray-400 mb-4">{{ capitalize(pokedex.selectedPokemon.name) }}'s got a few tricks up its sleeve — watch out for these non-STAB supereffective coverage moves.</p>
            <MoveList :list="pokedex.watchOutMoves" />
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

    #buff-moves span { @apply text-gray-300 inline-block px-1 py-0.5 mb-1 rounded bg-zinc-700 text-xs; }
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