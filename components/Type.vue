<template lang="">
    <div class="px-1.5 py-1 font-mono text-xs rounded-md inline-block text-white" :class="`bg-${pokedex.getColorByType(type)}`">
        {{ type }}
    </div>
</template>
<script setup>
    import { usePokedexStore } from '../stores/pokedex'
    const pokedex = usePokedexStore()
    const props = defineProps({
        type: String
    })
</script>
<style lang="">
    
</style>