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
    <div class="bg-slate-800 rounded-lg px-4 pt-4 pb-2 text-white font-mono text-xs w-full border-collapse mb-2 grid grid-cols-8 items-start">
        <div class="flex flex-col md:flex-row items-baseline content-between col-span-4">
            <div class="pt-1 flex-shrink-0 w-full sm:w-28 xl:w-44 rounded-l-lg flex flex-row flex-wrap items-baseline gap-2">
                <div v-if="showLevel" class="text-indigo-400 text-xxs order-2 md:order-0">Lv {{ move.level_learned_at }}</div>
                <div class="font-mono text-xs font-bold">{{ deslug(move.name) }}</div>
            </div>
            <div class="pr-2 mb-2 mt-2 md:mt-0"> <Type :type="move.type" /> </div>
        </div>
        <div class="col-span-2">
            <Thing :move="move" />
        </div>
        <div v-if="filteredTypes.length > 0 && move.damage_class != 'status'" class="rounded-r-lg">
            <span class="block whitespace-nowrap mb-2 mt-1 md:hidden">2x vs.</span>
            <Type v-for="type in filteredTypes" :type="type" class="mr-2 mb-2" />
        </div>
    </div>
</template>

<style scoped>
.row {
    display: grid;
    grid-template-columns: 3fr repeat(3, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 8px;
    grid-row-gap: 0px;
}
</style>