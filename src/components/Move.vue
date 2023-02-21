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
    <div class="bg-slate-800 rounded-lg px-4 pt-4 pb-2 text-white font-mono text-xs w-full border-collapse mb-2 flex flex-row items-start">
        <div class="pt-1 w-1/3 flex-shrink-0 rounded-l-lg">
            <span v-if="showLevel" class="text-indigo-400 text-xxs">Lv {{ move.level_learned_at }}</span>
            {{ deslug(move.name) }}
        </div>
        <div class="w-1/6 flex-shrink-0 pr-2"> <Type class="mb-2" :type="move.type" /> </div>
        <div class="pt-1 w-20 flex-shrink-0 flex flex-row"> <img class="w-6 mr-1" :src="`/icons/${move.damage_class}.png`" /><span class="w-5">{{ move.power }}</span></div>
        <div class="rounded-r-lg">
            <Type v-for="type in move.super_effective" :type="type" class="mr-2 mb-2" />
        </div>
    </div>
</template>