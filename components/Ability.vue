<template>
    <div class="ability" 
        @click="$emit('collapse', expand())"
        @collapse.once="collapse()"
    >
        <span class="ability-name">
            {{ capitalize(ability.ability.name) }}
            <span v-if="ability.is_hidden">(HA)</span>
        </span>
        <span v-if="expanded" class="ability-effect">{{ ability.effect }}</span>
    </div>
</template>
<script>
import { capitalize } from '../helpers/capitalize';
export default {
    name: 'Ability',
    props: ['ability'],
    data() {
        return {
            expanded: true
        }
    },
    methods: {
        capitalize,
        expand() {
            this.$emit('collapse')
            console.log('collapse everything else')
            this.expanded = true
        },
        collapse() {
            console.log('I heard the collapse emit', this.ability.name)
            this.expanded = false
        }
    }
}
</script>
<style>
.ability {
    @apply text-xs text-white font-mono rounded-xl bg-gray-800 px-2 py-1 inline-block;
    @apply w-full;
}
.ability-name {
    @apply font-bold;
}
.ability-effect {
    @apply w-full block mt-0.5 text-gray-400;
}
</style>