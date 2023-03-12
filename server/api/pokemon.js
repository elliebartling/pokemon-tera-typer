// // import { Resolvers } from '#graphql/resolver'
// import { ApolloServer } from '@apollo/server'
// import { startServerAndCreateH3Handler } from '@as-integrations/h3'
// import Pokedex from 'pokedex-promise-v2';
// const P = new Pokedex();

// const pokemon = await P.getResource('https://pokeapi.co/api/v2/pokedex/paldea')
//     .then(res => res.pokemon_entries)

// console.log('pokemon', pokemon)

// const pokemonTypes = P.getTypesList()
//     .then(res => res.results)
    
// // A schema is a collection of type definitions (hence "typeDefs")
// // that together define the "shape" of queries that are executed against
// // your data.
// const typeDefs = `#graphql
//     # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
//     type Pokemon {
//         entry_number: Int,
//         pokemon_species: PokemonSpecies
//     }

//     type PokemonSpecies {
//         name: String,
//         url: String
//     }

//     type PokemonType {
//         name: String,
//         url: String,
//         data: PokemonTypeData
//     }

//     type PokemonTypeData {
//         # damage_relations: DamageRelations,
//         # game_indices: [GameIndices],
//         # generation: Generation,
//         id: Int,
//         # move_damage_class: MoveDamageClass,
//         moves: [Move],
//         # names: [Names],
//         # past_damage_relations: DamageRelations,
//         pokemon: [Pokemon]
//     }

//     # type DamageRelations {
//     #     double_damage_to: [PokemonType],
//     #     double_damage_from: [PokemonType],
//     #     half_damage_to: [PokemonType],
//     #     half_damage_from: [PokemonType],
//     #     no_damage_to: [PokemonType],
//     #     no_damage_from: [PokemonType]
//     # }

//     type Move {
//         name: String,
//         url: String
//     }

//     # The "Query" type is special: it lists all of the available queries that
//     # clients can execute, along with the return type for each. In this
//     # case, the "books" query returns an array of zero or more Books (defined above).
//     type Query {
//         pokemon: [Pokemon],
//         pokemon_species: [PokemonSpecies],
//         pokemon_types: [PokemonType],
//         moves: [Move],
//         pokemon_type_data: PokemonTypeData
//         # damage_relations: [DamageRelations]
//     }
// `;


// // Resolvers define how to fetch the types defined in your schema.
// // This resolver retrieves books from the "books" array above.
// const resolvers = {
//     Query: {
//       pokemon: () => pokemon,
//       pokemon_types: () => pokemonTypes,
//       pokemon_type_data: () => P.getTypeByName('normal')
//     },
//   };

// // The ApolloServer constructor requires two parameters: your schema
// // definition and your set of resolvers.
// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
// });

// const apollo = new ApolloServer({ typeDefs, resolvers })

// export default startServerAndCreateH3Handler(apollo, {
//     // Optional: Specify context
//     // context: (event) => {...},
//  })


// // export default defineEventHandler(async() => {
// //   // Passing an ApolloServer instance to the `startStandaloneServer` function:
// //   //  1. creates an Express app
// //   //  2. installs your ApolloServer instance as middleware
// //   //  3. prepares your app to handle incoming requests
// //   const { url } = await startStandaloneServer(server, {
// //     listen: { port: 4000 },
// //   });
  
// //   console.log(`🚀  Server ready at: ${url}`);
// // })