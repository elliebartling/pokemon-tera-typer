<script setup>
import { usePokedexStore } from '../stores/pokedex'
import { computed } from 'vue'
import voca from 'voca'
import Type from './Type.vue'

const pokedex = usePokedexStore()
const props = defineProps({
    move: Object,
    showLevel: Boolean
})

const deslug = function (text) {
    return voca(text).replaceAll('-', ' ').titleCase()
}

</script>
<template>
    <!-- <div class="bg-slate-800 rounded-lg px-4 pt-2 md:pt-4 pb-2 text-white font-mono text-xs w-full border-collapse mb-2 grid grid-cols-8 items-start">
        <div class="flex flex-row items-center md:items-baseline content-between w-full md:w-1/2 col-span-8 md:col-span-4">
            <div class="pt-1 flex-shrink-0 w-full md:w-44 rounded-l-lg flex flex-row items-baseline gap-2">
                <div v-if="showLevel" class="text-indigo-400 text-xxs order-1 md:order-0">Lv {{ move.level_learned_at }}</div>
                <div class="font-sans md:font-mono text-lg md:text-xs order-0 md:order-2 font-bold">{{ deslug(move.name) }}</div>
            </div>
            <div class="pr-2"> <Type :type="move.type" /> </div>
        </div>
        <div class="pt-1 w-full md:w-20 flex-shrink-0 flex flex-row"> <img class="w-6 mr-1" :src="`/icons/${move.damage_class}.png`" /><span class="w-5">{{ move.power }}</span></div>
        <div v-if="move.super_effective.length > 0 && move.damage_class != 'status'" class="rounded-r-lg">
            <span class="md:invisible">2x vs. </span>
            <Type v-for="type in move.super_effective" :type="type" class="mr-2 mb-2" />
        </div>
    </div> -->
    <div class="bg-slate-800 rounded-lg px-4 pt-4 pb-2 text-white font-mono text-xs w-full border-collapse mb-2 grid grid-cols-8 items-start">
        <div class="flex flex-col md:flex-row items-baseline content-between col-span-4">
            <div class="pt-1 flex-shrink-0 w-full md:w-44 rounded-l-lg flex flex-row items-baseline gap-2">
                <div v-if="showLevel" class="text-indigo-400 text-xxs order-2 md:order-0">Lv {{ move.level_learned_at }}</div>
                <div class="font-mono text-xs font-bold">{{ deslug(move.name) }}</div>
            </div>
            <div class="pr-2 mb-2 mt-2 md:mt-0"> <Type :type="move.type" /> </div>
        </div>
        <div class="pt-1 w-24 col-span-2 flex-shrink-0 flex flex-row"> <img class="w-6 mr-1" :src="`/icons/${move.damage_class}.png`" /><span class="w-5">{{ move.power }}</span></div>
        <div v-if="move.super_effective.length > 0 && move.damage_class != 'status'" class="rounded-r-lg">
            <span class="hidden">2x vs. </span>
            <Type v-for="type in move.super_effective" :type="type" class="mr-2 mb-2" />
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