<template>
    <TransitionRoot :show="pokedex.showPalette" as="template" @after-leave="query = ''" appear>
      <Dialog as="div" class="relative z-10" @close="pokedex.showPalette = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
            <DialogPanel class="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-gray-900 shadow-2xl transition-all">
              <Combobox @update:modelValue="onSelect">
                <div class="relative">
                  <MagnifyingGlassIcon class="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500" aria-hidden="true" />
                  <ComboboxInput 
                    class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm" 
                    placeholder="Search..." 
                    @change="pokedex.setNewQuery($event.target.value)" 
                    />
                </div>
  
                <ComboboxOptions static class="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto">
                  <li v-if="pokedex.recentPokemon.length > 0" class="p-2">
                    <h2 class="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">Recent searches</h2>
                    <ul class="text-sm text-gray-400">
                        <ComboboxOption 
                            v-for="poke in pokedex.recentPokemon" 
                            :key="poke.name" 
                            :value="poke.name"
                            v-slot="{ active, selected }"
                            @update:modelValue="onSelect"
                            >
                                <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-white']">
                                <div class="flex items-center">
                                    <img :src="getSpriteUrl(poke)" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                                    <span :class="['ml-3 truncate', selected && 'font-semibold']">
                                    {{ capitalize(poke.name) }}
                                    </span>
                                </div>

                                <span v-if="selected" :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-400']">
                                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                                </li>
                            </ComboboxOption>
                    </ul>
                  </li>
                  <li class="p-2">
                    <h2 class="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">Results</h2>
                    <ul class="text-sm text-gray-400">
                        <ComboboxOption 
                        v-for="poke in pokedex.filteredPokemon" 
                        :key="poke.name" 
                        :value="poke.name"
                        v-slot="{ active, selected }"
                        @update:modelValue="onSelect"
                        >
                            <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-white']">
                            <div class="flex items-center">
                                <img :src="getSpriteUrl(poke)" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                                <span :class="['ml-3 truncate', selected && 'font-semibold']">
                                {{ capitalize(poke.name) }}
                                </span>
                            </div>

                            <span v-if="selected" :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-400']">
                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                            </li>
                        </ComboboxOption>
                    </ul>
                  </li>
                </ComboboxOptions>
  
                <div v-if="query !== '' && filteredPokemon.length === 0" class="py-14 px-6 text-center sm:px-14">
                  <FolderIcon class="mx-auto h-6 w-6 text-gray-500" aria-hidden="true" />
                  <p class="mt-4 text-sm text-gray-200">We couldn't find any Pokemon with that name. Please try again.</p>
                </div>
              </Combobox>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
<script setup>
  import { computed, ref } from 'vue'
  import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
  import { DocumentPlusIcon, FolderIcon, FolderPlusIcon, HashtagIcon, TagIcon } from '@heroicons/vue/24/outline'
  import {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
  } from '@headlessui/vue'
  import voca from 'voca'
  import { usePokedexStore } from '../stores/pokedex'

  const pokedex = usePokedexStore()

    // const debounce = (func, wait) => {
    //     let timeout;

    //     return function executedFunction(...args) {
    //         const later = () => {
    //         clearTimeout(timeout);
    //         func(...args);
    //         };

    //         clearTimeout(timeout);
    //         timeout = setTimeout(later, wait);
    //     };
    // };

  const getSpriteUrl = (pokemon) => {
    // console.log('trying to get dex number...', pokemon)
    const dexNumber = pokemon.id ? pokemon.id : pokemon.url.split('/').reverse()[1]
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dexNumber}.png`
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
  }
  
  const capitalize = function(text) {
      return voca(text).replaceAll('-', ' ').titleCase()
  }
  const query = ref('')

  function onSelect(item) {
    console.log('select', item)
    pokedex.setSelectedPokemon(item)
    pokedex.showPalette = false
    // window.location = item.name
  }
  </script>