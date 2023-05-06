const knex = require("../database/knex");

class NotesController {
    async create(request, response) {
        const { title, description, tags, links } = request.body;
        const user_id = request.user.id;

        const [note_id] = await knex("notes").insert({
            title,
            description,
            user_id
        }); // cadastrar a nota e recuperar o id da nota cadastrada

        const linksInsert = links.map(link => {
            return {
                note_id,
                url: link
            }
        }); // percorrer os links e para cada link criar um objeto inserindo o código da nota a qual o link está vinculado e mudando de link para url

        await knex("links").insert(linksInsert);

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        });

        await knex("tags").insert(tagsInsert);

        return response.json();
    }

    async show(request, response) {
        const { id } = request.params;

        const note = await knex("notes").where({ id }).first();
        // where({ id }) para selecionar a nota utilizando o id como parâmetro
        // first() para sempre retornar uma nota específica
        const tags = await knex("tags").where({ note_id: id }).orderBy("name");
        // orderBy("name") para organizar por ordem alfabética
        const links = await knex("links").where({ note_id: id }).orderBy("created_at");
        // orderBy("created_at") para organizar pela ordem que o link foi criado

        return response.json({
            ...note, // despejando todos os detalhes da nota
            tags,
            links
        });
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("notes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) { // listar as notas cadastradas no banco de dados, incluindo as tags e links
        const { title, tags } = request.query;

        const user_id = request.user.id;

        let notes;

        if (tags) {
            // se existir tags, fazer o filtro baseado em tags, caso contrário, fazer a consulta normal
            const filterTags = tags.split(',').map(tag => tag.trim());
            // enviar as tags em lista, converter o texto simples em vetor
            // converter o texto em array utilizando como delimitador a vírgula
            // map porque só interessa a tag

            notes = await knex("tags")
                // conectar tabelas tags e notes
                .select([
                    "notes.id",
                    "notes.title",
                    "notes.user_id",
                ]) // campos que deseja selecionar de ambas as tabelas
                .where("notes.user_id", user_id) // filtrar pelas tags do id do usuário
                .whereLike("notes.title", `%${title}%`)
                .whereIn("name", filterTags)
                // analisar baseado na tag
                // recebe como parâmetros o nome da tag e o vetor que deseja que compare se a tag existe ali ou não
                .innerJoin("notes", "notes.id", "tags.note_id")
                // conectar uma tabela com a outra
                // tabela que deseja conectar, campos usados para conectar as tabelas, campo em comum entre as tabelas
                .groupBy("notes.id") // para não trazer notas repetidas
                .orderBy("notes.title")
        } else {
            notes = await knex("notes")
                .where({ user_id })
                .whereLike("title", `%${title}%`)
                // operador like para buscar valores que contenham partes de uma palavra
                // o primeiro parâmetro é o campo utilizado para fazer a consulta
                // percentual envolvendo o conteúdo da variável pesquisada para pesquisar em qualquer parte da palavra
                .orderBy("title");
            // filtro para mostrar primeiro somente as notas criadas pelo usuário
            // organizar por ordem alfabética
        }

        const userTags = await knex("tags").where({ user_id });
        // filtrando as tags onde o id é igual ao id do usuário
        const notesWithTags = notes.map(note => { // percorrer todas as notas
            const noteTags = userTags.filter(tag => tag.note_id === note.id);
            // filtrar as tags da nota para saber onde o id da nota vinculada a tag é igual ao note.id

            return {
                ...note,
                tags: noteTags
            }
        });

        return response.json(notesWithTags);
    }
}

module.exports = NotesController;