const db = require('./dbConfig')

module.exports = {
  addUser,
  getUserByUsername
}

function addUser(user) {
  db('users').insert(user)
}

function getUserByUsername(username) {
  db('users').where('username', username).first();
}