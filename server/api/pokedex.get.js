import Pokedex from 'pokedex-promise-v2';
import paldea from '../../data/paldea.json';
const P = new Pokedex();

export default eventHandler(async (event) => {
    const event_pokes = [
        'charizard',
        'cinderace',
        'decidueye',
        // 'walking-wake',
        // 'iron-leaves',
        'greninja',
        'delibird',
        'samurott',
        'typhlosion'
    ]

    // let pokemon = await P.getResource('https://pokeapi.co/api/v2/pokedex/paldea')
    //     .then(res => res.pokemon_entries)
    //     .then(res => res.map(pokemon => pokemon.pokemon_species))

    let pokemon = paldea.data.pokemon
    
    const event_pokemon = await Promise.all(event_pokes.map(async poke => {
        let data
        try {
            data = await P.getPokemonByName(poke)
        } catch {
            console.log('error', poke)
        }

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