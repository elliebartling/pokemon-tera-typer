<script setup>
import { computed, ref } from 'vue'
import { usePokedexStore } from '../stores/pokedex'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import voca from 'voca'

const pokedex = usePokedexStore()

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const getSpriteUrl = (pokemon) => {
  // const dexNumber = pokemon.url.split('/').reverse()[1]
  // console.log(dexNumber)
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
}

</script>

<template>
  <main>
    <div>
      <Combobox as="div" v-model="pokedex.query">
        <ComboboxLabel class="block label">Pokémon:</ComboboxLabel>
        <div class="relative mt-1">
          <ComboboxInput 
            class="w-full rounded-md border text-white border-gray-600 bg-gray-700 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm" 
            @change="pokedex.setNewQuery($event.target.value)"
            :displayValue="(poke) => voca(poke).capitalize()"
          />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon class="h-5 w-5 text-white" aria-hidden="true" />
          </ComboboxButton>

          <ComboboxOptions class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <ComboboxOption 
              v-for="poke in pokedex.filteredPokemon" 
              :key="poke.name" 
              :value="poke.name"
              v-slot="{ active, selected }"
              >
                <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-white']">
                  <div class="flex items-center">
                    <img :src="getSpriteUrl(poke)" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                    <span :class="['ml-3 truncate', selected && 'font-semibold']">
                      {{ voca(poke.name).capitalize() }}
                    </span>
                  </div>

                  <span v-if="selected" :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-400']">
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
            </ComboboxOption>
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  </main>
</template>
