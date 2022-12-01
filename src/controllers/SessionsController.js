const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsController {
    async create(request, response) { // criando uma sessão para o usuário
        const { email, password } = request.body;

        const user = await knex("users").where({ email }).first();
        // filtrar o usuário pelo e-mail, .first() para garantir que retorne um usuário

        if (!user) { // validando usuário cadastrado
            throw new AppError("E-mail e/ou senha incorretos", 401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) { // validando senha
            throw new AppError("E-mail e/ou senha incorretos", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, { // gerando token do usuário
            subject: String(user.id), // conteúdo que deseja inserir dentro do token
            expiresIn
        })
        
        return response.json({ user, token });
    }
}

module.exports = SessionsController;