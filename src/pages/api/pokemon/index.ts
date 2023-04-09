export default async function handler(req: { query: any; variables: any; }, res: any) {

    const result = await fetch("https://beta.pokeapi.co/graphql/v1beta",
        {
            method: "POST",
            body: JSON.stringify({
                query: req.query,
                variables: req.variables,
                operationName: 'pokemon'
            })
        });
    return result.json();
}
const getQuery = `
    query pokemon($limit: Int) {
        pokemon_v2_pokemon(order_by: {id: asc}, limit: $limit) {
            pokemon_species_id
            id
            name
        }
         pokemon_v2_pokemon_aggregate {
            aggregate {
              count
            }
         }
    }
`;
export const getPokemon = async ({ limit = 24 }: { limit?: number } = {}) => {
    const result = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
        method: "POST",
        body: JSON.stringify({
            query: getQuery,
            variables: { limit },
            operationName: 'pokemon'
        })
    });
    const { data, error } = await result.json();
    if (error) {
        console.log(error);
        return null;
    }
    const { pokemon_v2_pokemon: results = [], pokemon_v2_pokemon_aggregate: ags = {} } = data;
    const { aggregate = {} } = ags;
    const { count: total = 0 } = aggregate;
    return {
        results,
        total
    };
}