require('dotenv').config({ path: __dirname + '/.env' });
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);// this is to validate the ObjectId in db
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const login = require('./routes/login');
const express = require('express');
const app = express();

if (!process.env.vidly_jwtPrivateKey) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}
// add json middleware of express to enable parsing the body of req
// populate req.body property
app.use(express.json()); // for parsing application/json
// to enable key=value&key=value in req route and populate req.body
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://localhost/vidly', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/login', login);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));