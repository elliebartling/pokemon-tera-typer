<script setup>
    const labels = ['HP ', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE']
    const props = defineProps({
        pokemon: Object,
        show: Array
    })
</script>

<template>
    <div id="chart" class="chart w-full text-xs">
        <template v-for="(stat, index) in pokemon.stats" :key="index">
            <div v-if="show.includes(index)" class="flex flex-row items-center font-mono w-full" :id="`stat-${index}`">
                <span class="stat mr-2 text-white w-10">{{ labels[index] }}</span>
                <span class="val mr-2 text-slate-500 w-10">{{ stat.base_stat }}</span>
                <span class="w-full">
                    <span class="bar" :style="`width: ${stat.base_stat / 150 * 100}%`"></span>
                </span>
            </div>
        </template>
    </div>
</template>

<style scoped>
.bar { @apply bg-gradient-to-r from-violet-700 via-purple-600 to-rose-400 rounded-full block h-1.5; }
</style>