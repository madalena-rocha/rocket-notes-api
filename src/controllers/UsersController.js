const { hash, compare } = require("bcryptjs"); // hash é a função que vai gerar a criptografia da senha
const AppError = require("../utils/AppError");

const UserRepository = require("../repositories/UserRepository");
const sqliteConnection = require("../database/sqlite"); // importando a conexão com o banco de dados
const UserCreateService = require("../services/UserCreateService");

/*
    Controllers

    Quando uma requisição chega no arquivo server.js, que é o ponto de entrada da aplicação, passa pelas rotas 
    para que seja identificado qual controller deve ser executado. Após executar a requisição, o controller 
    devolve para a rota, que devolve para o usuário que fez a solicitação através do server.js.
*/

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const userRepository = new UserRepository(); // instanciando o userRepository porque ele é uma classe
        const userCreateService = new UserCreateService(userRepository);
        
        await userCreateService.execute({ name, email, password });

        return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const user_id = request.user.id;
        // não é mais necessário pegar o id do usuário pelo parâmetro, pois agora ele está ircorporado nas requisições

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

        if (!user) {
            throw new AppError("Usuário não encontrado.");
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            // verificar se o usuário está tentando mudar o e-mail para um e-mail que já existe de outro usuário
            throw new AppError("Este e-mail já está em uso.");
        }

        user.name = name ?? user.name; // se existir conteúdo dentro de name, utilize, se não, utilize o user.name (nome existente no banco)
        user.email = email ?? user.email; // ?? é o nullish coalescing operator

        if (password && !old_password) {
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha.");
        }

        if (password && old_password) {
            // se tanto o password como o old_password forem informados, verificar se a senha antiga é igual à senha cadastrada no banco
            const checkOldPassword = await compare(old_password, user.password);
            // necessário usar o compare porque o old_password está criptografado, enquanto o password não está
        
            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere.");
            }

            user.password = await hash(password, 8);
        }
        
        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, user_id]
        ); // atualize na tabela de usuários e defina os seguintes valores
        
        return response.status(200).json(); // pode omitir o status 200, pois o status de sucesso será retornado por padrão
    }
}

module.exports = UsersController;
