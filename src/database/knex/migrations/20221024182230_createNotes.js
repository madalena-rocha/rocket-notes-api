exports.up = knex => knex.schema.createTable("notes", table => {
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("user_id").references("id").inTable("users");
    // criando na tabela notes um campo do tipo inteiro chamado user_id, que faz referência ao id que existe dentro da tabla users
    // obrigatoriamente deve existir um usuário para criar uma nota, pois a nota estará vinculada a algum usuário

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("notes");
