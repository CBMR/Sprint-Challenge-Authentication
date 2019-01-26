const db = require('./dbConfig')

module.exports = {
  addUser,
  getUserByUsername,
  getUserById
}

function addUser(user) {
return  db('users').insert(user)
}

function getUserByUsername(username) {
return  db('users').where('username', username).first();
}

function getUserById(id) {
  return db('users').where({id}).first()
}