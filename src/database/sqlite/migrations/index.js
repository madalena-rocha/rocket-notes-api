const sqliteConnection = require("../../sqlite");
const createUsers = require("./createUsers");

async function migrationsRun() {
    const schemas = [ // tabelas que o banco vai ter
        createUsers
    ].join(""); // join para juntar todas as migrations usando nada como parâmetro
    
    sqliteConnection()
    .then(db => db.exec(schemas)) // executando as migrations
    .catch(error => console.error(error));
}

module.exports = migrationsRun;