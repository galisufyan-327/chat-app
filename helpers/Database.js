/* eslint-disable */

const dbParameters = require('../knexfile');
// eslint-disable-next-line import/order
const knex = require('knex')(dbParameters);

const { attachPaginate } = require('knex-paginate');
attachPaginate();

/* eslint-enable */

module.exports = knex;
