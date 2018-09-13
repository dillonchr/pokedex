const domget = require('@dillonchr/domget');

const pokemon = process.argv[2];

if (!pokemon) {
    console.log('No pokemon argument');
    process.exit();
}

console.log(`Looking up ${pokemon}`);
domget(`https://pokemondb.net/pokedex/${pokemon.toLowerCase()}`, (err, dom) => {
    const TYPES_ROWS = [
        ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground'],
        ['flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']
    ];
    const types = Array.from(dom.querySelectorAll('.tabset-basics table.type-table'))
        .slice(0, 2)
        .map((table, i) => {
            console.log(table);
            const tds = Array.from(table.querySelectorAll('tbody tr:last-child td'));
            console.log('TDS', tds);
            return tds
                .reduce((obj, td, j) => {
                    const effectiveness = td.textContent.replace('½', '0.5').replace('¼', '0.25') || '1';
                    obj[TYPES_ROWS[i][j]] = parseFloat(effectiveness);
                    return obj;
                 }, {});
        })
        .reduce((types, split) => {
            Object.entries(split)
                .filter(([k,v]) => v !== 1)
                .forEach(([k,v]) => {
                    types[k] = v;
                });
            return types;
        }, {});
    console.log(types);
});

