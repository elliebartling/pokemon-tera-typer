<script setup>
import Move from './Move.vue'

const props = defineProps({
    list: Array,
    showLevel: Boolean
})
</script>

<template>
    <div class="bg-black bg-opacity-20 rounded-xl w-full px-4 md:px-4 pb-3 -ml-6 relative" style="width: calc(100% + 3rem)">
        <div class="flex flex-col w-full">
          <div class="flex flex-row w-full text-white font-mono text-xs px-4 py-4 rounded-t-lg">
            <div class="w-1/3">Name</div>
            <div class="w-1/6">Type</div>
            <div class="w-20">Damage</div>
            <div class="hidden md:block">2x vs.</div>
          </div>
          <Move 
            v-for="move in list"
            class="mr-2 mb-2"
            :showLevel="showLevel"
            :key="move.name"
            :move="move" />
          </div>
      </div>

</template>