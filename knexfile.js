const config = require('config');

module.exports = {
  client: config.database.client,
  connection: config.database.connection,
  pool: {
      min: config.database.pool.min,
      max: config.database.pool.max
  },
  migrations: {
      tableName: config.database.migrations.tableName
  }
};
