import Pokedex from 'pokedex-promise-v2';
import typeColors from '../../data/typeColors.json'
const P = new Pokedex();

export default eventHandler(async (event) => {    

    // Get all the types, and only return the data we need
    const { results } = await P.getTypesList()
    const pokemonTypes = await Promise.all(results.map(t => P.getTypeByName(t.name)))
        .then(allTypes => allTypes
            .filter(t => t.name !== 'unknown' && t.name !== 'shadow')
            .map(t => {
                return { 
                    damage_relations: t.damage_relations,
                    id: t.id,
                    name: t.name,
                    color: typeColors[t.name] 
                }
            })
        )

    return pokemonTypes
})