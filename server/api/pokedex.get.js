import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

export default eventHandler(async (event) => {
    const event_pokes = [
        'charizard',
        'cinderace',
        'decidueye',
        'walking-wake',
        'iron-leaves',
        'greninja',
        'delibird'
    ]

    let pokemon = await P.getResource('https://pokeapi.co/api/v2/pokedex/paldea')
        .then(res => res.pokemon_entries)
        .then(res => res.map(pokemon => pokemon.pokemon_species))
    
    const event_pokemon = await Promise.all(event_pokes.map(async poke => {
        const data = await P.getPokemonByName(poke)

        return {
            name: poke,
            url: data.species.url
        }
    }))

    // Add event_pokemon array to pokemon array
    pokemon.push(...event_pokemon)
    // console.log('ohheydata', pokemon)

    return pokemon
})