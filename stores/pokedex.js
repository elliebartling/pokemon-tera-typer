import { defineStore } from 'pinia'
import Lazy from "lazy.js"
// import _ from lodash
import voca from 'voca'
import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

function isInList(name, list) {
  return Lazy(list).find((n) => { return n.name === name })
}

export const usePokedexStore = defineStore('pokedex', {
  state: () => ({ 
    pokemon: [],
    types: [],
    query: '',
    selectedPokemon: {},
    selectedStarLevel: 5,
    recentPokemon: [],
    selectedPokemonDamageRelations: {
      // The pokemon's offense
      offense: {
        resist: [],
        neutral: []
      },
      // The pokemon's defense
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
    showPalette: false,
    selectedTeraType: false,
  }),
  getters: {
    filteredPokemon() {
      if (!this.pokemon && !this.loaded) return []

      const q = voca(this.query).lowerCase()
      const list = Lazy(this.pokemon)
        .filter((pokemon) => { return pokemon.name.includes(q) })
        .shuffle()
        .toArray()
        .slice(0,20)

      // if (list.length == 1) { this.setSelectedPokemon(list[0].name) }
      return list
    },
    pokemonLevel() {
      return this.starRatings[this.selectedStarLevel - 1].level
    },
    pokemonStats() {
      return !this.loaded ? null : Lazy(this.selectedPokemon.stats)
        .map((stat) => { return stat.base_stat })
        .toArray()
    },
    pokemonPrimaryAttackVector() {
      if (!this.loaded || !this.selectedPokemon.stats) return null
      // Check if ATK > SPA
      const ATK = this.selectedPokemon.stats[1].base_stat
      const SPA = this.selectedPokemon.stats[3].base_stat
      if (ATK > SPA) { return 'physical' } else if (ATK < SPA) { return 'special' } else { return 'either' }
    },
    pokemonPrimaryDefenseVector() {
      if (!this.loaded || !this.selectedPokemon.stats) return null
      // Check if DEF < SPD
      const DEF = this.selectedPokemon.stats[2].base_stat
      const SPD = this.selectedPokemon.stats[4].base_stat
      if (DEF > SPD) { return 'special' } else if (DEF < SPD) { return 'physical' } else { return 'either' }
    },
    allOverlappedTyping() {
      if (!this.loaded || !this.selectedPokemon.stats) return null
      return Lazy(this.resistedOverlappedTyping)
        .concat(this.neutralOverlappedTyping)
        // .map((n) => n.name)
        .toArray()
    },
    resistedOverlappedTyping() {
      if (!this.loaded || !this.selectedPokemonDamageRelations.defense.resist) return null
      const defensive_types = this.selectedPokemonDamageRelations.defense.resist

      const comboTypes = Lazy(this.selectedPokemonDamageRelations.offense)
        .concat(defensive_types)
        .groupBy('name')
        .filter(function(v){return v.length > 1})
        .flatten()
        .uniq('name')
        .toArray()

      return comboTypes
    },
    neutralOverlappedTyping() {
      if (!this.loaded || !this.selectedPokemonDamageRelations.defense.neutral) return null
      const defensive_types = this.selectedPokemonDamageRelations.defense.neutral
      const comboTypes = Lazy(this.selectedPokemonDamageRelations.offense)
        .concat(defensive_types)
        .groupBy('name')
        .filter(function(v){return v.length > 1})
        .flatten()
        .uniq('name')
        .toArray()
 
      return comboTypes
    },
    watchOutMoves() {
      if (!this.loaded && !this.selectedPokemon) return null
      // console.log('starting watchoutmoves', this.selectedPokemon)

      const selectedPokemonTypes = Lazy(this.selectedPokemon.types)
        .map((t, i) => { 
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
        // .filter((m) => { return m.damage_class === this.pokemonPrimaryAttackVector })
        .filter((m) => { 
          const { super_effective } = m
          const recommendedTypes = Lazy(this.resistedOverlappedTyping)
            .concat(this.neutralOverlappedTyping)
            // .map((t) => { return t.name })
            .toArray()

          return super_effective.some( r => recommendedTypes.includes(r) )
        })
        .toArray()

      // console.log('watchoutmoves', watchOutMoves, selectedPokemonTypes)
      return watchOutMoves
    },
    typeChart() {
      if (!this.loaded) return null

      // ----------------------------------------
      // Get player offensive data
      // ----------------------------------------

      // Get the detailed type data for the selected tera type
      const pokemonTeraType = this.getTypeByName(this.selectedTeraType.name)

      // Get super-effective types against the selected tera type
      const superEffectiveTypes = pokemonTeraType.damage_relations.double_damage_from

      // Pull damage relations from the tera type
      const { double_damage_from, no_damage_from, half_damage_from } = pokemonTeraType.damage_relations

      // Search this.types for any types that the tera type does not resist
      const neutralEffectiveTypes = Lazy(this.types)
        .filter((type) => {
          // Filter out types that are in double_damage_from, no_damage_from, or half_damage_from
          const isNeutral = !isInList(type.name, double_damage_from) && !isInList(type.name, no_damage_from) && !isInList(type.name, half_damage_from)
          // const isNeutral = !double_damage_from.includes(pokemonTeraType) && !no_damage_from.includes(pokemonTeraType) && !half_damage_from.includes(pokemonTeraType)
          return isNeutral
        })
        .toArray()
      
      // ----------------------------------------
      // Get player defensive data
      // ----------------------------------------
      
      // Get types array from state with data
      const typesWithData = this.selectedPokemon.types.map((t) => this.getTypeByName(t.type.name))

      // Get basic info: what does this type do half + no damage to?
      const no_damage_to = Lazy(typesWithData)
        .pluck('damage_relations')
        .pluck('no_damage_to')
        .flatten()
        .uniq('name')
        .toArray()

      const half_damage_to = Lazy(typesWithData)
        .pluck('damage_relations')
        .pluck('half_damage_to')
        .flatten()
        .uniq('name')
        .toArray()

      // Now, check for double typing conflicts:
      // If this type does double damage to a type that's resisted by
      // the other type, that's not good defensive typing
      const double_damage_to = Lazy(typesWithData)
        .pluck('damage_relations')
        .pluck('double_damage_to')
        .flatten()
        .uniq('name')
        .toArray()
      
      console.log('double_damage_to', double_damage_to)
      // Join half and no damage to arrays
      const superResistTypes = Lazy(half_damage_to)
        .concat(no_damage_to)
        .toArray()
      
      // Get neutral types by process of elimination — filter out types that are in reistTypes
      const neutralResistTypes = Lazy(this.types)
        .reject((type) => {
          return isInList(type.name, superResistTypes) || isInList(type.name, double_damage_to)
        })
        .toArray()
      
      let quadrants = {
        quad1: [],
        quad2: [],
        quad3: [],
        quad4: [],
        quad5: []
      }

      console.log('resistTypes', superResistTypes, 'neutralTypes', neutralResistTypes)
      Lazy(this.types)
        .each((type) => {
          // Quad 1: super effective, super resisted
          if (isInList(type.name, superEffectiveTypes) && isInList(type.name, superResistTypes)) {
            quadrants.quad1.push(type)
          // Quad 2: super effective, neutral resisted
          } else if (isInList(type.name, superEffectiveTypes) && isInList(type.name, neutralResistTypes)) {
            quadrants.quad2.push(type)
          // Quad 3: neutral effective, super resisted
          } else if (isInList(type.name, neutralEffectiveTypes) && isInList(type.name, superResistTypes)) {
            quadrants.quad3.push(type)
          } else if (isInList(type.name, neutralEffectiveTypes) && isInList(type.name, neutralResistTypes)) {
            quadrants.quad4.push(type)
          } else {
            quadrants.quad5.push(type)
          }
        })

      return {
        defense: {
          super: superResistTypes,
          neutral: neutralResistTypes
        },
        offense: {
          super: superEffectiveTypes,
          neutral: neutralEffectiveTypes
        },
        quadrants
      }
    }
  },
  actions: {
    async init() {

      // Get the bulk of the data from the cached API
      const pokemon = await $fetch('/api/pokedex')
      this.pokemon = pokemon

      const pokemonTypes = await $fetch('/api/types')
      this.types = pokemonTypes

      // Give everyone a starter pokemon
      this.setSelectedPokemon('pikachu')

      // Set the default tera type
      this.setTeraType(pokemonTypes[2])
      // this.loaded = true
    },
    setNewPokemon() {
      console.log('set new poke')
      // this.loaded = false

      if (this.filteredPokemon.length === 1) {
        const poke = this.filteredPokemon[0]
        this.setSelectedPokemon(poke.name)
      } else if (this.filteredPokemon.length > 20) {
        return this.filteredPokemon.slice(0,30)
      }
    },
    async getPokemonByName(query) {
      const poke = await P.getPokemonByName(query)
      this.selectedPokemon = poke
      return poke
    },
    async getAbilityDetails(ability) {
      const ability_details = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query samplePokeAPIquery {
            pokemon_v2_ability(where: {name: {_eq: "${ability}"}}) {
              id
              name
              effect: pokemon_v2_abilityeffecttexts(where: {language_id: {_eq: 9}}) {
                short_effect
              }
            }
          }
          `
        })
      })
      .then((res) => res.json())
      .then((result) => {
        return result.data.pokemon_v2_ability[0].effect[0].short_effect
      })
      return ability_details
    },
    async setSelectedPokemon(name) {
      console.log('setting pokemon', name)
      this.loaded = false
      const poke = await P.getPokemonByName(name)
      // console.log('setting poke', poke, name)

      this.selectedPokemon = poke
      this.getDefenseSuperEffectiveTypes(poke.types)
      this.formatMoveset(poke.moves)

      // Go get ability details & format those, too
      Lazy(poke.abilities)
        .each(async (ab, i) => {
          const effect = await this.getAbilityDetails(ab.ability.name)
          this.selectedPokemon.abilities[i].effect = effect
        })
      
      this.addToRecent(poke)
      this.loaded = true

      // console.log('getting pokemon')
      // const pokemon = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     query: `query samplePokeAPIquery {
      //       pokemon_v2_pokemon(where: {name: {_eq: "meowscarada"}}) {
      //         id
      //         name
      //         abilities: pokemon_v2_pokemonabilities {
      //           data: pokemon_v2_ability {
      //             name
      //           }
      //         }
      //         moves: pokemon_v2_pokemonmoves {
      //           level
      //           pokemon_v2_move {
      //             name
      //             power
      //             type_id
      //             damage_class: pokemon_v2_movedamageclass {
      //               name
      //             }
      //           }
      //         }
      //         stats:pokemon_v2_pokemonstats {
      //           base_stat
      //         }
      //         types: pokemon_v2_pokemontypes {
      //           data: pokemon_v2_type {
      //             name
      //           }
      //         }
      //       }
      //     }`
      //   })
      // })
      // // .catch((err) => {console.log(err)})
      // .then((res) => res.json())
      // .then((result) => {
      //   console.log('init formattng', result.data)
      //   let poke = result.data.pokemon_v2_pokemon[0]

      //   poke.types = poke.types.map((t) => { return t.name })

      //   console.log(poke)

      //   return poke
      // })

      // return pokemon
      // console.log('got poke?',pokemon)
  
    },
    setNewQuery(query) {
      this.query = query
    },
    openPalette() {
      this.query = ''
      this.showPalette = true
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
      const damageInfo = this.getTypeByName(type)

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
    getTypeByName(name) {
      return this.types.find((t) => t.name === name)
    },
    async getDefenseSuperEffectiveTypes(types) {
      console.log('getting superfective types for', types)
      let superEffective

      // Get types array from state with data
      const typesWithData = await types.map((t) => this.getTypeByName(t.type.name))

      console.log('typeswithdata', typesWithData)

      // const type = this.types.find((type) => type.name === t.type.name)
      // console.log('type', type)

      // Get basic info: what does this type do half + no damage to?
      const no_damage_to = Lazy(typesWithData)
        .pluck('damage_relations')
        .pluck('no_damage_to')
        .flatten()
        .uniq('name')
        .toArray()

      const half_damage_to = Lazy(typesWithData)
        .pluck('damage_relations')
        .pluck('half_damage_to')
        .flatten()
        .uniq('name')
        .toArray()

      // Now, check for double typing conflicts:
      // If this type does double damage to a type that's resisted by
      // the other type, that's not good defensive typing
      const double_damage_to = Lazy(typesWithData)
        .pluck('damage_relations')
        .pluck('double_damage_to')
        .flatten()
        .uniq('name')
        .toArray()

      console.log('double to', double_damage_to, 'half to', half_damage_to, 'no to', no_damage_to)

      superEffective = Lazy(half_damage_to)
        .concat(no_damage_to)
        .uniq('name')
        .reject((val) => {
          const isOverlapped = Lazy(double_damage_to).findWhere({ name: val.name })
          return isOverlapped != undefined 
        })
        .toArray()
      
      console.log(this.types, superEffective)
      const neutral = Lazy(this.types)
        .reject((type) => {
          return superEffective.find((t) => t.name === type.name) != undefined
        })
        .reject((type) => {
          return double_damage_to.find((t) => t.name === type.name) != undefined
        })
        .toArray()

      console.log('neutral', neutral)
      console.log('resist', superEffective)
      this.selectedPokemonDamageRelations.defense.neutral = neutral
      this.selectedPokemonDamageRelations.defense.resist = superEffective
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
    },
    addToRecent(poke) {
      // console.log('adding to recent', poke)
      this.recentPokemon = Lazy(this.recentPokemon)
        .concat(poke)
        .uniq('name')
        .toArray()
      
      // console.log(this.recentPokemon)
    }
  }
})