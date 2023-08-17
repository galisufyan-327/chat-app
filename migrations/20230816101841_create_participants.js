exports.up = (knex) => {
  return knex.schema.createTable("participants", (table) => {
    table.increments("participant_id").primary();
    table.integer("conversation_id").unsigned();
    table.integer("user_id").unsigned();
    table.timestamps(true, true);

    table
      .foreign("conversation_id")
      .references("conversations.id");
    table.foreign("user_id").references("users.id");
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists("participants");
};
