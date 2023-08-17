
const {
  knex,
  Validators
} = require('../helpers');

class UserHandler {

  static findUserByEmail (email) {

    return knex('users')
      .select('*')
      .where('email', email)
      .first();

  }

  static findUserExceptCurrent(email) {
    return knex('users')
      .select('*')
      .whereNot({
        email
      });
  }

  static createUser ({ email, name, password }) {

    return knex('users')
      .insert({
        email,
        username: name,
        password
      }).returning('*');

  }

 

  static setAccessToken (userId, accessToken, refreshToken) {

    return knex('users')
      .where('id', Validators.parseInteger(userId, -1))
      .update({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).returning('*');

  }

  static getAuthenticateUser (userId, email = " ", authToken) {

    return knex('users')
      .select('*')
      .where({
        email,
        id: Validators.parseInteger(userId, -1),
        access_token: authToken,
      })
      .first();
  }


}

module.exports = UserHandler;
