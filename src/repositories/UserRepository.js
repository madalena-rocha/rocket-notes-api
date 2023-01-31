const sqliteConnection = require("../database/sqlite");

class UserRepository {
    async findByEmail(email) {
        const database = await sqliteConnection(); // aguardar a conexão com o banco de dados
        const user = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
        // get para buscar por informações
        // aplicar filtro para pesquisar por usuários onde o e-mail seja igual ao informado
        // para inserir o conteúdo da variável: email = (?)", [email] vai substituir ? pelo e-mail que está dentro da variável e-mail
    
        return user;
    }

    async create({ name, email, password }) {
        const database = await sqliteConnection();

        const userId = await database.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, password]
        );
    
        return { id: userId };
    }
}

module.exports = UserRepository;