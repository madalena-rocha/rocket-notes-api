exports.up = knex => knex.schema.createTable("tags", table => {
    table.increments("id");
    table.text("name").notNullable(); // não permite nulo
    
    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
    // as tags serão utilizadas para fazer filtro nas notas
    // onDelete("CASCADE"): se deletar a nota que a tag está vinculada, automaticamente deleta a tag
    table.integer("user_id").references("id").inTable("users");
});

exports.down = knex => knex.schema.dropTable("tags");
