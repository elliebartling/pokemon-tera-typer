<script setup>
const props = defineProps({
    move: Object
})
</script>
<template>
    <div class="tag" :class="move.damage_class">
        <img class="w-6 mr-1" :src="`/icons/${move.damage_class}.png`" />
        <span class="">{{ move.power }}</span>
    </div>
</template>
<style scoped>
.physical {
    @apply bg-slate-900;
}

.special {
    @apply bg-slate-900;
}

.status {
    @apply bg-slate-900;
}

.tag {
    @apply pt-1 inline-flex flex-row inline-block pb-1 px-2;
    @apply rounded-md;
}
</style>