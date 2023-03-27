<script setup>
import Move from './Move.vue'

const props = defineProps({
    list: Array,
    showLevel: Boolean,
    filterEffectiveBy: Array
})
</script>

<template>
    <div class="bg-black bg-opacity-20 rounded-xl w-full px-4 md:px-4 pb-3 -ml-6 relative" style="width: calc(100% + 3rem)">
        <div class="flex flex-col w-full">
          <div class="row text-white font-mono text-xs px-4 py-4 rounded-t-lg">
            <div class="col-span-2 md:col-span-1">Name</div>
            <div class="col-span-1 hidden md:block">Type</div>
            <div class="col-span-2">Damage</div>
            <div class="col-span-2 hidden md:block">2x vs.</div>
          </div>
          <Move 
            v-for="move in list"
            class="mr-2 mb-2"
            :showLevel="showLevel"
            :key="move.name"
            :filterEffectiveBy="filterEffectiveBy"
            :move="move" />
          </div>
      </div>

</template>
<style scoped>
.row {
    display: grid;
    grid-template-columns: 2fr repeat(6, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 8px;
    grid-row-gap: 0px;
}
</style>