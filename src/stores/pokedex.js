import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Lazy from "lazy.js"

import * as Pokedex from 'pokeapi-js-wrapper'
const P = new Pokedex.Pokedex()

export const usePokedexStore = defineStore('pokedex', {
  state: () => ({ 
    pokemon: [],
    query: 'fletchinder',
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
    loaded: false,
    typeColors: {
          "normal": "zinc-400",
          "fighting": "orange-700",
          "flying": "sky-500",
          "poison": "violet-700",
          "ground": "yellow-900",
          "rock": "zinc-600",
          "bug": "lime-600",
          "ghost": "violet-900",
          "steel": "slate-600",
          "fire": "red-600",
          "water": "blue-600",
          "grass": "emerald-600",
          "electric": "yellow-500",
          "psychic": "pink-500",
          "ice": "cyan-400",
          "dragon": "sky-700",
          "dark": "slate-700",
          "fairy": "rose-400",
      },
      types: []
  }),
  getters: {
    filteredPokemon() {
      const results = this.pokemon ? this.pokemon.filter((pokemon) => pokemon.name.includes(this.query)).slice(0,40) : null
      if (results.length == 1) { this.setSelectedPokemon(results[0].name) }
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
      const ATK = this.selectedPokemon.stats[1].base_stat
      const SPA = this.selectedPokemon.stats[3].base_stat
      if (ATK > SPA) { return 'physical' } else if (ATK < SPA) { return 'special' } else { return 'either' }
    },
    pokemonPrimaryDefenseVector() {
      if (!this.selectedPokemon.stats) return null
      // Check if DEF < SPD
      const DEF = this.selectedPokemon.stats[2].base_stat
      const SPD = this.selectedPokemon.stats[4].base_stat
      if (DEF > SPD) { return 'special' } else if (DEF < SPD) { return 'physical' } else { return 'either' }
    },
    overlappedTyping() {
      const comboTypes = Lazy(this.selectedPokemonDamageRelations.offense)
        .concat(this.selectedPokemonDamageRelations.defense)
        .groupBy('name')
        .filter(function(v){return v.length > 1})
        .flatten()
        .uniq('name')
        .toArray()

      // console.log('combotypes', comboTypes)
      return comboTypes
    },
    watchOutMoves() {
      if (!this.selectedPokemon.types) return null
      // console.log('starting watchoutmoves', this.selectedPokemon)

      const selectedPokemonTypes = Lazy(this.selectedPokemon)
        .get('types')
        .map((t, i) => { 
          // console.log("t", t)
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
    getTypes() {
      console.log('getting types')
      fetch('https://beta.pokeapi.co/graphql/v1beta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query samplePokeAPIquery {
            types: pokemon_v2_type {
              name
              id
              pokemon_v2_typeefficacies {
                damage_factor
                target_type: pokemonV2TypeByTargetTypeId {
                  name
                }
              }
            }
          }`
        })
      })
      .then((res) => res.json())
      .then((result) => {
        const {types} = result.data
        const typesWithData = Lazy(types)
          .map((t) => {
            let strength
            const efficiencies = Lazy(t.pokemon_v2_typeefficacies)
              .map((f) => {
                f['target_type'] = f['target_type'].name
                return f
              })
              .groupBy('damage_factor')
              .toObject()
            
            Lazy(efficiencies)
              .keys()
              .each((g, i) => {
                // console.log('g', g, i, efficiencies[i], efficiencies[g])

                const new_factors = efficiencies[g].map((i) => { 
                  // console.log('i', i)
                  return i.target_type 
                })

                efficiencies[g] = new_factors

                // g is an array of damage factors, with redundant damage_factor data
                // g = [{ damage_factor : 50, target_type: rock }, { damage_factor : 50, target_type: steel }]
                // for each group of damage factors
                // iterate over each individual factor
                // and return just the target type so that g = ['rock', 'steel']
                // { damage_vs: { 50: [arr], 100: [arr], 200: [arr] } }
              })
              
            t['color'] = this.typeColors[t.name]
            t['damage_vs'] = efficiencies
            return t
          })
          .reject((t) => t.name === 'shadow' || t.name === 'unknown' )
          .toArray()
          this.types = typesWithData
        // console.log(typesWithData)
      })
    },
    setNewPokemon() {
      console.log('set new poke')
      // this.loaded = false

      if (this.filteredPokemon.length === 1) {
        const poke = this.filteredPokemon[0]
        this.setSelectedPokemon(poke.name)
      } else if (results.length > 20) {
        return results.slice(0,30)
      }
    },
    async getPokemonSpeciesList() {
      // const species = await P.getPokemonSpeciesList()
      const new_species = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query samplePokeAPIquery {
            pokemon: pokemon_v2_pokemonspecies(where: {pokemon_v2_pokemondexnumbers: {pokemon_v2_pokedex: {name: {_eq: "paldea"}}}}) {
              name
              id
            }
          }
          `
        })
      })
      .then((res) => res.json())
      .then((result) => { 
        console.log(result) 
        this.pokemon = result.data.pokemon
      })
      // this.pokemon = species.results
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
      this.loaded = true
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
          // .filter(async (t) => { 
          //   // for each type
          //   // find the types that are supereffective against it
          //   console.log('type', t)
          //   const super_effective = await P.getTypeByName(t)
          //   // check to see if that array includes this type
          //   console.log('supaeffective', super_effective)
          //   // if yes, reject

          //   // const { super_effective } = t
          //   // const recommendedTypes = Lazy(this.overlappedTyping)
          //   //   .map((t) => { return t.name })
          //   //   .toArray()
            
          //   return t
          //   // return super_effective.some( r => recommendedTypes.includes(r) )
          // })


      let superEffective

      const typePromiseArray = await Lazy(types)
        .map(async (type) => {
          return await P.getTypeByName(type.type.name)
        })
        .toArray()

      Promise.all(typePromiseArray).then((values) => {
        console.log('values', values)

        // Get basic info: what does this type do half + no damage to?
        const no_damage_to = Lazy(values)
          .pluck('damage_relations')
          .pluck('no_damage_to')
          .flatten()
          .uniq('name')
          .toArray()

        const half_damage_to = Lazy(values)
          .pluck('damage_relations')
          .pluck('half_damage_to')
          .flatten()
          .uniq('name')
          .toArray()

        // Now, check for double typing conflicts:
        // If this type does double damage to a type that's resisted by
        // the other type, that's not good defensive typing
        const double_damage_to = Lazy(values)
          .pluck('damage_relations')
          .pluck('double_damage_to')
          .flatten()
          .uniq('name')
          .toArray()

        // const no_damage_from = Lazy(values)
        //   .pluck('damage_relations')
        //   .pluck('no_damage_from')
        //   .flatten()
        //   .uniq('name')
        //   .toArray()

        console.log('double to', double_damage_to, 'half to', half_damage_to, 'no to', no_damage_to)
        superEffective = Lazy(half_damage_to)
          .concat(no_damage_to)
          .uniq('name')
          .reject((val) => {
            const isOverlapped = Lazy(double_damage_to).findWhere({ name: val.name })
            return isOverlapped != undefined 
          })
          .toArray()
        this.selectedPokemonDamageRelations.defense = superEffective
      })
    },
    async getNeutralDefensiveTyping(types) {

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