const  knex = require("../database/knex");

class TagsController { // listar todas as tags cadastradas do usuário
    async index(request, response) {
        const { user_id } = request.params;

        const tags = await knex("tags")
            .where({ user_id })
            // como o nome é exatamente o mesmo no banco de dados, não é necessário colocar user_id: user_id

        return response.json(tags);
    }
}

module.exports = TagsController;