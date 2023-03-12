<script setup>
import { usePokedexStore } from '../stores/pokedex'
import voca from 'voca'
import Type from './Type.vue'

const pokedex = usePokedexStore()
// const moves = pokedex.selectedPokemonMoveset

  // const people = [
  //   { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  //   // More people...
  // ]
</script>

<template>
  <div class="mt-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-white">Moves</h1>
        <p class="mt-2 text-sm text-zinc-400">A list of all the moves you might face — watch out for anything that might be supereffective against your Pokemon!</p>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-my-2 -mx-6 lg:-mx-8">
        <div class="inline-block min-w-full align-middle rounded-lg border border-zinc-700">
          <table class="min-w-full border-separate border-spacing-0 rounded-tl-md rounded-tr-md rounded-md divide-zinc-700 bg-zinc-900">
            <thead>
              <tr class="border-collapse">
                <th scope="col" class="sticky top-0 z-10 border-b border-zinc-600 text-white bg-opacity-0 py-3.5 pl-6 pr-3 text-left text-sm font-semibold backdrop-blur backdrop-filter lg:pl-8 rounded-tl-md">Move name</th>
                <th scope="col" class="sticky top-0 z-10 hidden border-b border-zinc-600 text-white bg-opacity-0 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:table-cell">Level</th>
                <th scope="col" class="sticky top-0 z-10 hidden border-b border-zinc-600 text-white bg-opacity-0 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:table-cell">Power</th>
                <th scope="col" class="sticky top-0 z-10 hidden border-b border-zinc-600 text-white bg-opacity-0 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:table-cell">Type</th>
                <th scope="col" class="sticky top-0 z-10 hidden border-b border-zinc-600 text-white bg-opacity-0 px-3 py-3.5 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:table-cell rounded-tr-md">Damage Class</th>
                <!-- <th scope="col" class="sticky top-0 z-10 hidden border-b border-zinc-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 backdrop-blur backdrop-filter lg:table-cell">Email</th>
                <th scope="col" class="sticky top-0 z-10 border-b border-zinc-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 backdrop-blur backdrop-filter">Role</th>
                <th scope="col" class="sticky top-0 z-10 border-b border-zinc-300 bg-white bg-opacity-75 py-3.5 pr-6 pl-3 backdrop-blur backdrop-filter lg:pr-8">
                  <span class="sr-only">Edit</span>
                </th> -->
              </tr>
            </thead>
            <tbody>
              <!-- <template v-for="moveChunk in pokedex.selectedPokemonMoveset" :key="moveChunk"> -->
              <template v-if="pokedex.selectedPokemonMoveset">
                <tr class="border-t border-zinc-600">
                  <th colspan="5" scope="colgroup" class="bg-zinc-700 sticky top-12 py-2 pl-6 pr-3 text-left text-sm font-semibold text-white sm:pl-6">By Level Up</th>
                </tr>
                <tr v-for="(move, personIdx) in pokedex.selectedPokemonMoveset['level-up']" :key="move.name">
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['level-up'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-white lg:pl-8']">{{ voca.chain(move.name).replaceAll('-', ' ').titleCase() }}</td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['level-up'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']">{{ move.level_learned_at }}</td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['level-up'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']">{{ move.power }}</td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['level-up'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']"><Type :type="move.type" /></td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['level-up'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']">{{ move.damage_class }}</td>
                </tr>
                <tr class="border-t border-zinc-600">
                  <th colspan="5" scope="colgroup" class="bg-zinc-700 sticky top-12 py-2 pl-6 pr-3 text-left text-sm font-semibold text-white sm:pl-6">By Breeding</th>
                </tr>
                <tr v-for="(move, personIdx) in pokedex.selectedPokemonMoveset['egg']" :key="move.name">
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['egg'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-white lg:pl-8']">{{ voca.chain(move.name).replaceAll('-', ' ').titleCase() }}</td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['egg'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']">{{ move.level_learned_at }}</td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['egg'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']">{{ move.power }}</td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['egg'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']"><Type :type="move.type" /></td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['egg'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']">{{ move.damage_class }}</td>
                </tr>
                <tr class="border-t border-zinc-600">
                  <th colspan="5" scope="colgroup" class="bg-zinc-700 sticky top-12 py-2 pl-6 pr-3 text-left text-sm font-semibold text-white sm:pl-6">By Technical Machine</th>
                </tr>
                <tr v-for="(move, personIdx) in pokedex.selectedPokemonMoveset['machine']" :key="move.name">
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['machine'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-white lg:pl-8']">{{ voca.chain(move.name).replaceAll('-', ' ').titleCase() }}</td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['machine'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']">{{ move.level_learned_at }}</td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['machine'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']">{{ move.power }}</td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['machine'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']"></td>
                  <td :class="[personIdx !== pokedex.selectedPokemonMoveset['machine'].length - 1 ? 'border-b border-zinc-800' : '', 'whitespace-nowrap px-3 py-4 text-sm text-white table-cell']">{{ move.damage_class }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>