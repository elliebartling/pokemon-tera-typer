<script>
import { mapStores } from 'pinia'
import { usePokedexStore } from '../stores/pokedex'
import { ref } from 'vue'
import Picker from './Picker.vue'
import voca from 'voca'

export default {
    setup() {
        const pokedex = usePokedexStore()
    },
    components: {
        Picker
    },
    data() {
        return {
            collapsed: false
        }
    },
    computed: {
        ...mapStores(usePokedexStore)
    },
    methods: {
        capitalize(text) {
            return voca(text).capitalize()
        }
    }
}

</script>

<template>
    <div 
        :class="[collapsed ? 'collapsed' : 'expanded']" 
        class="card mt-8 text-gray-200 gap-y-7 flex flex-col" 
    >
        <button v-if="collapsed" @click="this.collapsed = !this.collapsed">
            <div class="flex flex-row items-center gap-6">
                <label>{{ capitalize(pokedexStore.selectedPokemon.name) }}</label>
                <button 
                    class="tera-type tera-type-selected"
                    :class="`bg-${pokedexStore.selectedTeraType.color}`">
                    <img class="w-8" :src="`/icons/${pokedexStore.selectedTeraType.name}.svg`" />
                </button>
                <div class="flex flex-row gap-2 items-center">
                    <label>{{ pokedexStore.selectedStarLevel }}</label>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6">
                        <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                    </svg>   
                </div>
            </div>
        </button>
        <template v-else>
            <div class="flex flex-col gap-6">
                <Picker />
                <div id="star-level-picker" class="block w-1/2">
                    <label class="block label">
                        Star Level: 
                        <span class="font-mono block text-xs text-gray-400">({{ pokedexStore.selectedStarLevel }} Stars, Level {{ pokedexStore.pokemonLevel }})</span>
                    </label>
                    <div class="flex flex-row justify-start items-center">
                      <div v-for="star in pokedexStore.starRatings" :key="star.stars">
                        <button class="star" @click="pokedexStore.selectedStarLevel = star.stars">
                          <svg v-if="pokedexStore.selectedStarLevel >= star.stars" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full">
                            <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                          </svg>                    
                          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full fill-inherit">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>                    
                        </button>
                      </div>
                    </div>
                  </div>
            </div>

            <div id="tera-type-picker" class="">
                <label class="label inline-block">Tera Type:</label>
                <div class="tera-type-picker">
                  <div v-for="type in pokedexStore.types" :key="type.name">
                    <button 
                      @click="pokedexStore.setTeraType(type)" 
                      class="tera-type"
                      :class="[
                        pokedexStore.selectedTeraType.name === type.name ? 
                        'tera-type-selected' : 'ring-purple-500/20', 
                        `bg-${type.color}`
                    ]">
                      <img class="w-8" :src="`/icons/${type.name}.svg`" />
                    </button>
                  </div>
                </div>
              </div>
        
        </template>
    </div>
</template>

<style scoped>
.tera-type-picker {
    @apply flex flex-row gap-4 md:grid md:grid-cols-5 md:grid-rows-3;
    @apply overflow-x-scroll py-4 px-2;
}
.star {
    @apply w-6 h-6 text-white;
}
.tera-type {
    @apply w-12 h-12;
    @apply ring ring-4 ring-offset-2;
    @apply p-3 sm:p-4;
    @apply rounded-full;
    @apply opacity-70;
    @apply ring-offset-gray-900;
}

.tera-type.tera-type-selected {
    @apply ring-purple-500;
    @apply opacity-100;
}

.collapsed {
    @apply flex flex-row justify-between items-center gap-7 text-base;
    @apply sticky top-40;
}
</style>