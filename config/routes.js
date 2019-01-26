const axios = require('axios');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { authenticate } = require('../auth/authenticate');
const usersDb = require('../database/userHelpers')

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

const secret = process.env.JWT_SECRET
const generateToken = (user) => {
  const payload = {
    username: user.username
  };

  const options = {
    expiresIn: '30m',
    jwtid: '789123'
  }
  return jwt.sign(payload, secret, options)
}

function register(req, res) {
  // implement user registration
  const credentials = req.body;
  
  const hash = bcrypt.hashSync(credentials.password, 12);
  credentials.password = hash

  usersDb.addUser(credentials)
    .then( ids => {
      const id = ids[0]

      usersDb.getUserById(id)
        .then( user => {
          const token = generateToken(user)
          res.status(200).json({user, token})
        })
    })
    .catch(err => {
      console.log(err)
    })
}

function login(req, res) {
  // implement user login
  const credentials = req.body;
  if (credentials.username) {
    usersDb.getUserByUsername(credentials.username)
      .then( user => {
        if(user && bcrypt.compareSync(credentials.password, user.password)) {
          const token = generateToken(user)
          res.status(200).json({user, token})
        } else {
          res.status(401).json({err: "invalid username or password"})
        }
      })
      .catch( err => {
        res.status(500).json({err: "invalid username or password"})
      })
  }
  else {
    res.status(400).json({errMessage: "please insert a username"})
  }
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
