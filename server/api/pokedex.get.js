import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

export default eventHandler(async (event) => {    

    const pokemon = await P.getResource('https://pokeapi.co/api/v2/pokedex/paldea')
        .then(res => res.pokemon_entries)
        .then(res => res.map(pokemon => pokemon.pokemon_species))

    return pokemon
})