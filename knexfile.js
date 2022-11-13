const path = require("path");

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
      // partindo desta pasta, acesse a pasta src, dentro dela a pasta database, dentro dela o arquivo database.db
    },
    pool: { // executado no momento de estabelecer conexão com o banco de dados
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
      // após criar, recuperar a conexão e a função de callback
      // PRAGMA foreign_keys = ON para habilitar a funcionalidade de, quando deletar, por exemplo, uma nota, deletar em cascata as tags
    },
    migrations: { 
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    },
    useNullAsDefault: true
  }
};
