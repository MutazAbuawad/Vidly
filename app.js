require('dotenv').config({path: __dirname + '/.env'});
const Joi = require("joi");
const morgan = require('morgan');
const logger = require('./logger');
const express = require("express"); // returns a function
const app = express();


// add json middleware of express to enable parsing the body of req
// populate req.body property 
app.use(express.json());  // for parsing application/json
// to enable key=value&key=value in req route and populate req.body
app.use(express.urlencoded({ extended : true })); // for parsing application/x-www-form-urlencoded
// to enable serving static files
// http://localhost:3000/readme.txt
app.use(express.static('public'));
// custom middleware function
app.use(logger);
// HTTP request logger
app.use(morgan('tiny'));


const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
  { id: 4, name: "course4" }
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// How to get api/route params from api endpoint -- for essential/ required values
// api/courses/1
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if (!course) {
    return res.status(404).send(`The course with the given ID ${req.params.id} was not found`);
  }

  res.status(200).send(course);
});

app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params);
});

// How to get query strng params from endpoint -- for optional values
// api/posts/:year?sortBy=name
app.get("/api/posts/:year", (req, res) => {
  res.send(req.query);
});

// to enable req.body to work we need to enable parsing of json object in body of req

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);

  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  // Look up the course
  // If not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if (!course) {
   return res.status(404).send(`The course with the given ID ${req.params.id} was not found`);
  }

  // validate
  // if invalid. return 400 - bad request
  const { error } = validateCourse(req.body); // object destructure

  if (error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // update course
  course.name = req.body.name;
  // return the updated course
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  // Look up the course
  // If not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));

  if (!course) {
    return  res.status(404).send(`The course with the given ID ${req.params.id} was not found`);
  }

  // delete course
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // return the deleted course
  res.send(course);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
}

// add a port so server can listening on
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
