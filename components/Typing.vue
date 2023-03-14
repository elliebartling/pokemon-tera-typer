<template>
    <div id="typing" class="card">
        <h2 class="title">Strategy</h2>
        <hr class="mt-4 -left-2 relative" />
        <div class="damage-class">
            <p class="">🏰 Defense:</p>
            <span class="damage-class-pill">
                <img v-if="pokedex.pokemonPrimaryAttackVector != 'either'" :src="`/icons/${pokedex.pokemonPrimaryAttackVector}.png`" />{{ pokedex.pokemonPrimaryAttackVector }}
            </span>
        </div>
        <div class="damage-class">
            <p class="">⚔️ Offense:</p>
            <span class="damage-class-pill">
                <img v-if="pokedex.pokemonPrimaryDefenseVector != 'either'" :src="`/icons/${pokedex.pokemonPrimaryDefenseVector}.png`" />{{ pokedex.pokemonPrimaryDefenseVector }}
            </span>
        </div>
        <hr class="mt-2 -left-2 relative" />
        <div v-if="pokedex.loaded" id="type-chart" class="type-chart-outer">
            <div class="header defense w-full">
                <div class="row">
                    <label>🏰 Def vs.</label>
                    <Type 
                        v-if="pokedex.selectedPokemon" 
                        v-for="type in pokedex.selectedPokemon.types"
                        class="mb-2"
                        :type="type.type.name" 
                    />
                </div>
                <div class="row table-header">
                    <div class="">Resist</div>
                    <div class="">Neutral</div>
                </div>
            </div>
            <div class="header offense">
                <div class="row">
                    <label>⚔️ Off vs.</label>
                    <Type 
                        v-if="pokedex.selectedTeraType" 
                        class="mb-2"
                        :type="pokedex.selectedTeraType.name" 
                    />
                </div>
                <div class="row table-header">
                    <div class="">Neutral vs.</div>
                    <div class="">Super Eff.</div>
                </div>
            </div>
            <table class="type-chart-inner">
                <tr class="offense-super">
                    <td>
                        <Type 
                            v-for="type in pokedex.typeChart?.quadrants.quad1"
                            class="mr-2 mb-2"
                            :type="type.name" 
                        />
                    </td>
                    <td><Type 
                            v-for="type in pokedex.typeChart?.quadrants.quad2"
                            class="mr-2 mb-2"
                            :type="type.name" 
                        /></td>
                </tr>
                <tr class="offense-neutral">
                    <td><Type 
                            v-for="type in pokedex.typeChart?.quadrants.quad3"
                            class="mr-2 mb-2"
                            :type="type.name" 
                        /></td>
                    <td><Type 
                            v-for="type in pokedex.typeChart?.quadrants.quad4"
                            class="mr-2 mb-2"
                            :type="type.name" 
                        /></td>
                </tr>
            </table>
        </div>
        <div class="beware">
            <p class="pre-wrap">Don't use: </p>
            <div class="flex flex-row flex-wrap">
                <Type 
                    v-for="type in pokedex.typeChart?.quadrants.quad5"
                    class="mr-2 mb-2"
                    :type="type.name" 
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { usePokedexStore } from '../stores/pokedex'
const pokedex = usePokedexStore()

const adjustHeight = function() {
    // Get the height of the type chart and assign the width of the offense header
    // to match the height of the type chart
    const typeChart = document.querySelector('.type-chart-inner')
    const offenseHeader = document.querySelector('.header.offense')
    const offenseHeaderHeight = typeChart != null ? typeChart.offsetHeight : 0
    if (offenseHeader) { offenseHeader.style.width = `${offenseHeaderHeight}px` }
}

onMounted(() => {
    adjustHeight()
    window.addEventListener('resize', adjustHeight)
})

const quads = computed(() => pokedex.loaded ? pokedex.typeChart.quadrants : null)

watch(quads, (current, old) => {
    console.log('quadrants changed', current, old)
    nextTick(() => {
        adjustHeight()
    })
}, { deep: true })
</script>
<style scoped>
#typing { @apply pr-2; }
#type-chart {
    @apply w-full relative pl-14 mt-4;
}

.damage-class {
    @apply flex flex-row justify-between items-center gap-x-2 mt-2;
    @apply text-xs font-medium mr-4 text-gray-300 font-mono;
}
.damage-class-pill {
    @apply font-mono rounded-md text-white text-xs inline-flex flex-row bg-slate-700 px-2 py-1;
    img { @apply w-6 mr-2;}
}
.header { 
    @apply text-sm text-gray-500 font-mono; 
    @apply flex flex-col justify-center items-center gap-x-1;
    @apply bg-slate-800 rounded-t-md pt-2;
}

.header .row { @apply flex flex-row justify-center items-baseline gap-x-1 w-full; }

.header .row.table-header { 
    @apply text-xs grid grid-cols-2 w-full text-center text-white; 
    @apply bg-gradient-to-r from-violet-500 to-rose-400/0 py-2 rounded-t-md;
}

.header.offense {
    @apply w-80;
    @apply -rotate-90 absolute;
    transform-origin: bottom left;
    /* top: calc(100% + 72px); */
    bottom: 0;
}

.header.offense .row.row.table-header {
    @apply bg-gradient-to-l;
}

.type-chart-inner {
    @apply w-full text-white text-xs font-mono;
    tr { @apply h-36; }
    td { @apply border border-gray-700 w-1/2 p-2 align-top; }
}

.beware {
    @apply text-xs text-gray-500 font-mono;
    @apply flex flex-col md:flex-row justify-start items-baseline gap-x-1 gap-y-2;
    @apply pt-8;
}
</style>