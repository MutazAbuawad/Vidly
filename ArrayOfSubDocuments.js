const dbDebugger = require('debug')('app:db');
const express = require('express'); // returns a function
const mongooese = require('mongoose');


const app = express();


mongooese
    .connect('mongodb://localhost/coursesDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => dbDebugger('Connected to MongoDB'))
    .catch(err => console.error('Could not connected to MongoDB', err.message));


const authorSchema = mongooese.Schema({
    name: String
});

// Embeded Approach
const courseSchema = mongooese.Schema({
    name: String,
    authors: [authorSchema]
});

// mongoose.model compiles the cousreSchema into Course class so can instantiate an objects/documents from that class
const Course = mongooese.model('Course', courseSchema);

const Author = mongooese.model('Author', authorSchema);

async function createCourse(name, authors) {
    const course = new Course({
        name,
        authors
    });
    console.log(authors);
    console.log(course.authors)
    console.log(course.name)

    const result = await course.save();
    console.log(result)
}

async function addAuthor(courseId, author) {
    const course = await Course.findById(courseId);
    course.authors.push(author); // saves in memory
    const res = await course.save(); // save into db
    console.log(res)
}

async function deleteAuthor(courseId, authorId){
    const course = await Course.findById(courseId);
    const author = course.authors.id(authorId);
    console.log(author)
    const res = await author.remove();// remove from memory
    console.log(res)
    const res2 = await course.save();// remove from db
    console.log(res2)
}


// createCourse('c#', [
//     new Author({ name: 'Jason' }),
//     new Author({ name: 'John' })
// ])

// addAuthor('5d7fdf671ede241950cab87d',new Author({name : 'Jack'}))
deleteAuthor('5d7fdf671ede241950cab87d','5d7fdf671ede241950cab87b')


// add a port so server can listening on
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
