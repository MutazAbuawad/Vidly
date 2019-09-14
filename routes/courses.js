const express = require('express');
const router = express.Router();
const Joi = require('joi');


const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
    { id: 4, name: "course4" }
];

router.get("/", (req, res) => {
    res.send(courses);
});

// How to get api/route params from api endpoint -- for essential/ required values
// api/courses/1
router.get("/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        return res.status(404).send(`The course with the given ID ${req.params.id} was not found`);
    }

    res.status(200).send(course);
});

router.get("/:year/:month", (req, res) => {
    res.send(req.params);
});

// How to get query strng params from endpoint -- for optional values
// api/posts/:year?sortBy=name
router.get("/:year", (req, res) => {
    res.send(req.query);
});

// to enable req.body to work we need to enable parsing of json object in body of req

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
        return res.status(404).send(`The course with the given ID ${req.params.id} was not found`);
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

module.exports = router;