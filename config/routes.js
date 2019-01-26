const axios = require('axios');
const bcrypt = require('bcryptjs')

const { authenticate } = require('../auth/authenticate');
const usersDb = require('../database/userHelpers')

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  const credentials = req.body
  console.log(credentials)
  const hash = bcrypt.hashSync(credentials.password, 12);
  credentials.password = hash

  usersDb.addUser(credentials)
    .then( ids => {
      console.log(ids)
    })
    .catch(err => {
      console.log(err)
    })
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
