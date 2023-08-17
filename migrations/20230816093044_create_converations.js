exports.up = (knex) => {
  return knex.schema.createTable('conversations', (table) => {
    table.increments('id').primary();
    table.text('title');
    table.enum('type', ['group', 'one_on_one']);
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('conversations');
};
