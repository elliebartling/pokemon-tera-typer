import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Lazy from "lazy.js"

import * as Pokedex from 'pokeapi-js-wrapper'
const P = new Pokedex.Pokedex()

export const usePokedexStore = defineStore('pokedex', {
  state: () => ({ 
    pokemon: [],
    query: 'meowscarada',
    selectedPokemon: {},
    selectedTeraType: false,
    selectedStarLevel: 5,
    selectedPokemonDamageRelations: {
      // The Tera Pokemon's offensive type
      offense: {},
      // The Tera Pokemon's defensive type
      defense: []
    },
    selectedPokemonMoveset: [],
    selectedPokemonWatchoutMoveTypes: [],
    starRatings: [
      { stars: 1, level: "12" },
      { stars: 2, level: "20" },
      { stars: 3, level: "35" },
      { stars: 4, level: "45" },
      { stars: 5, level: "75" },
      { stars: 6, level: "90" },
      { stars: 7, level: "100" },
    ],
    types: [
      {
          "name": "normal",
          "url": "/api/v2/type/1/",
          "color": "zinc-400"
      },
      {
          "name": "fighting",
          "url": "/api/v2/type/2/",
          "color": "orange-700"
      },
      {
          "name": "flying",
          "url": "/api/v2/type/3/",
          "color": "sky-500"
      },
      {
          "name": "poison",
          "url": "/api/v2/type/4/",
          "color": "violet-700"
      },
      {
          "name": "ground",
          "url": "/api/v2/type/5/",
          "color": "yellow-900"
      },
      {
          "name": "rock",
          "url": "/api/v2/type/6/",
          "color": "zinc-600"
      },
      {
          "name": "bug",
          "url": "/api/v2/type/7/",
          "color": "lime-600"
      },
      {
          "name": "ghost",
          "url": "/api/v2/type/8/",
          "color": "violet-900"
      },
      {
          "name": "steel",
          "url": "/api/v2/type/9/",
          "color": "slate-600"
      },
      {
          "name": "fire",
          "url": "/api/v2/type/10/",
          "color": "red-600"
      },
      {
          "name": "water",
          "url": "/api/v2/type/11/",
          "color": "blue-600"
      },
      {
          "name": "grass",
          "url": "/api/v2/type/12/",
          "color": "emerald-600"
      },
      {
          "name": "electric",
          "url": "/api/v2/type/13/",
          "color": "yellow-500"
      },
      {
          "name": "psychic",
          "url": "/api/v2/type/14/",
          "color": "pink-500"
      },
      {
          "name": "ice",
          "url": "/api/v2/type/15/",
          "color": "cyan-400"
      },
      {
          "name": "dragon",
          "url": "/api/v2/type/16/",
          "color": "sky-700"
      },
      {
          "name": "dark",
          "url": "/api/v2/type/17/",
          "color": "slate-700"
      },
      {
          "name": "fairy",
          "url": "/api/v2/type/18/",
          "color": "rose-400"
      }
  ]
  }),
  getters: {
    filteredPokemon() {
      const results = this.pokemon.filter((pokemon) => pokemon.name.includes(this.query))

      if (results.length === 1) {
        const poke = results[0]
        console.log('only oneeee', poke)
        this.setSelectedPokemon(poke.name)
      } else if (results.length > 20) {
        return results.slice(0,30)
      }

      return results
    },
    pokemonLevel() {
      return this.starRatings[this.selectedStarLevel - 1].level
    },
    pokemonStats() {
      return Lazy(this.selectedPokemon.stats)
        .map((stat) => { return stat.base_stat })
        .toArray()
    },
    pokemonPrimaryAttackVector() {
      if (!this.selectedPokemon.stats) return null
      // Check if ATK > SPA
      return this.selectedPokemon.stats[1].base_stat > this.selectedPokemon.stats[3].base_stat ? "physical" : "special"
    },
    pokemonPrimaryDefenseVector() {
      if (!this.selectedPokemon.stats) return null
      // Check if DEF < SPD
      return this.selectedPokemon.stats[2].base_stat < this.selectedPokemon.stats[4].base_stat ? "physical" : "special"
    },
    overlappedTyping() {
      const comboTypes = Lazy(this.selectedPokemonDamageRelations.offense)
        .concat(this.selectedPokemonDamageRelations.defense)
        .groupBy('name')
        .filter(function(v){return v.length > 1})
        .flatten()
        .uniq('name')
        .toArray()

      console.log('combotypes', comboTypes)
      return comboTypes
    },
    watchOutMoves() {
      if (!this.selectedPokemon.types) return null
      // console.log('starting watchoutmoves', this.selectedPokemon)

      const selectedPokemonTypes = Lazy(this.selectedPokemon)
        .get('types')
        .map((t, i) => { 
          console.log("t", t)
          return t && t.type ? t.type.name : null 
        })
      
      this.selectedPokemonWatchoutMoveTypes = selectedPokemonTypes
      
      // console.log('selectedpoketypes', selectedPokemonTypes)

      const watchOutMoves = Lazy(this.selectedPokemonMoveset)
        .flatten()
        .groupBy('type')
        .omit(selectedPokemonTypes)
        .flatten()
        .reject({ damage_class: 'status' })
        .filter((m) => { return m.power > 50 })
        .filter((m) => { return m.damage_class === this.pokemonPrimaryAttackVector })
        .filter((m) => { 
          const { super_effective } = m
          const recommendedTypes = Lazy(this.overlappedTyping)
            .map((t) => { return t.name })
            .toArray()

          return super_effective.some( r => recommendedTypes.includes(r) )
        })
        .toArray()

      // console.log('watchoutmoves', watchOutMoves, selectedPokemonTypes)
      return watchOutMoves
    }
  },
  actions: {
    async getPokemonSpeciesList() {
      const species = await P.getPokemonSpeciesList()
      this.pokemon = species.results
    },
    async getPokemonByName(query) {
      const poke = await P.getPokemonByName(query)
      this.selectedPokemon = poke
      return poke
    },
    async setSelectedPokemon(name) {
      const poke = await P.getPokemonByName(name)
      this.selectedPokemon = poke
      this.getDefenseSuperEffectiveTypes(poke.types)
      this.formatMoveset(poke.moves)
    },
    setNewQuery(query) {
      this.query = query
    },
    setTeraType(type) {
      this.selectedTeraType = type
      this.getOffensiveSuperEffectiveTypes(type.name)
    },
    getColorByType(type) {
      const t = this.types.find((t) => type === t.name)
      return t ? t.color : "white"
    },
    async getOffensiveSuperEffectiveTypes(type) {
      // Get type info from API
      const damageInfo = await P.getTypeByName(type)

      // Set type info
      this.selectedPokemonDamageRelations.offense = damageInfo.damage_relations.double_damage_from
    },
    async getMoveData(moves) {
      const m = await Promise.all(Lazy(moves)
        .map(async (move) => {
          let m = {
            "name": move["move"].name,
            "move_learn_method": move.version_group_details.at(-1).move_learn_method.name,
            "level_learned_at": move.version_group_details.at(-1).level_learned_at
          }

          const moveWithData = await P.getMoveByName(move["move"].name)
          const superEffective = await this.getSuperEffectiveAgainst(moveWithData.type.name)

          m['type'] = moveWithData.type.name
          m['damage_class'] = moveWithData.damage_class.name
          m['power'] = moveWithData.power
          m['super_effective'] = superEffective

          return m
        })
        .toArray())
      
      return m
    },
    async formatMoveset(moves) {
      const m = await this.getMoveData(moves)

      const movesWithTypes = Lazy(m)
        .sortBy('level_learned_at')
        .groupBy('move_learn_method')
        .reverse()
        .toObject()

      this.selectedPokemonMoveset = movesWithTypes
    },
    async getDefenseSuperEffectiveTypes(types) {
      let superEffective

      const typePromiseArray = await Lazy(types)
        .map(async (type) => {
          return await P.getTypeByName(type.type.name)
        })
        .toArray()

      Promise.all(typePromiseArray).then((values) => {
        const flatterArray = Lazy(values)
          .pluck('damage_relations')
          .pluck('half_damage_to')
          .flatten()
          .toArray()

        superEffective = Lazy(flatterArray)
          .map((value) => {
            const damageLevel = Lazy(flatterArray)            
              .filter((v) => { 
                return value.name === v.name 
              })
              .toArray()
              .length
            
            value['damage'] = damageLevel * 2
            return value
          })
          .uniq('name')
          .toArray()
        
        this.selectedPokemonDamageRelations.defense = superEffective
      })
    },
    async getSuperEffectiveAgainst(type) {
      const typeInfo = await P.getTypeByName(type)

      // console.log('typeinfo', typeInfo)

      const superEffective = Lazy(typeInfo.damage_relations.double_damage_to)
        .map((t) => { return t.name })
        .toArray()

      // console.log("superEffective", superEffective)
      return superEffective
    }
  }
})