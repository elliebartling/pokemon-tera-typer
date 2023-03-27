<script>
import { usePokedexStore } from '../stores/pokedex'
import voca from 'voca'
import Type from './Type.vue'
import Thing from './Thing.vue'
import Lazy from 'lazy.js'
import { mapStores } from 'pinia'

export default {
    props: ['move', 'showLevel', 'filterEffectiveBy'],
    components: { Thing, Type },
    computed: {
        ...mapStores(usePokedexStore),
        filteredTypes() {
            if (!this.filterEffectiveBy) return this.move.super_effective
            if (this.move.super_effective == undefined) return []
            const super_effective = this.move.super_effective
            // console.log('filtered types', this.move, super_effective, this.filterEffectiveBy)
            // Take the existing supereffective types array
            // Filter out anything that's not also in the FilterEffectiveBy array
            // Filter each supereffective type by whether it's also in filterEffectiveBy
            return Lazy(super_effective)
                .filter((t) => this.filterEffectiveBy.includes(t))
                .toArray()
        }
    },
    methods: {
        deslug (text) {
            return voca(text).replaceAll('-', ' ').titleCase()
        }
    }
}
</script>
<template>
    <div class="move row">
        <div class="wrapper col-span-2">
            <div class="move-data">
                <div v-if="showLevel" class="text-indigo-400 text-xxs order-2 md:order-0">Lv {{ move.level_learned_at }}</div>
                <div class="font-mono text-xs font-bold">{{ deslug(move.name) }}</div>
            </div>
            <div class="pr-2 mb-2 mt-2 md:mt-0"> <Type :type="move.type" /> </div>
        </div>
        <div class="col-span-2">
            <Thing :move="move" />
        </div>
        <div v-if="filteredTypes.length > 0 && move.damage_class != 'status'" class="rounded-r-lg flex flex-row flex-wrap flex-grow col-span-3">
            <!-- <span class="block whitespace-nowrap mb-2 mt-1 md:hidden">2x vs.</span> -->
            <Type v-for="pokemonType in filteredTypes" :type="pokemonType" class="mr-2 mb-2" />
        </div>
    </div>
</template>

<style scoped>
.move { @apply bg-slate-800 rounded-lg px-4 pt-4 pb-2 text-white font-mono text-xs w-full border-collapse mb-2 grid grid-cols-8 items-start;}
.wrapper { 
    @apply flex flex-col; 
    @apply md:flex-row;
    @apply items-baseline content-between;
}

.move-data {
    @apply pt-1 flex-shrink-0 w-full sm:w-36 rounded-l-lg flex flex-row flex-wrap items-baseline gap-2;
}
.row {
    display: grid;
    grid-template-columns: 2fr repeat(6, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 8px;
    grid-row-gap: 0px;
}
</style>