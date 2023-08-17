
exports.up = knex => knex.schema.createTable('users', (table) => {

  table.increments("id");
  table.string("username");
  table.string("email").unique();
  table.string("password", 100);
  table.timestamps(true, true);
  table.string('access_token').unique();
  table.string('refresh_token').unique();
});

exports.down = knex => knex.schema.dropTable('users');
