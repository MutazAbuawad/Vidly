require('dotenv').config({ path: __dirname + '/.env' });
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const conf = require('config');
const morgan = require('morgan');
const logger = require('./middlewares/logger');
const express = require('express'); // returns a function
const mongooese = require('mongoose');

const courses = require('./routes/courses');
const home = require('./routes/home');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // default

// add json middleware of express to enable parsing the body of req
// populate req.body property
app.use(express.json()); // for parsing application/json
// to enable key=value&key=value in req route and populate req.body
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// to enable serving static files
// http://localhost:3000/readme.txt
app.use(express.static('public'));
// custom middleware function
app.use(logger);
if (app.get('env') === 'development') {
  // HTTP request logger
  app.use(morgan('tiny'));
  startupDebugger('Morgane Enabled');
}

console.log(conf.get('name'));
console.log(conf.get('mail.host'));
console.log(conf.get('mail.password'));

app.use('/api/courses', courses);
app.use('/', home);

mongooese
  .connect('mongodb://localhost/coursesDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => dbDebugger('Connected to MongoDB'))
  .catch(err => console.error('Could not connected to MongoDB', err.message));

// const courseSchema = mongooese.Schema({
//   name: { type: String, required: true },
//   author: String,
//   tags: [String],
//   price: Number,
//   date: { type: String, default: Date.now },
//   isPublished: Boolean
// });

const courseSchema = mongooese.Schema({
  name : String,
  author: {
    type: mongooese.Schema.Types.ObjectId,
    ref: 'Author'
  }
});

// mongoose.model compiles the cousreSchema into Course class so can instantiate an objects/documents from that class
const Course = mongooese.model('Course', courseSchema);

const Author = mongooese.model('Author',mongooese.Schema({
    name: String,
    bio: String,
    website: String
  })
);

// Create a course
async function createCourse() {
  const course = new Course({
    name: 'Angular.js course',
    author: 'Mosh',
    tags: ['angular', 'frontend'],
    price: 10,
    isPublished: true
  });

  const result = await course.save();
  console.log(result);
}

// Create an author
async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author
  });

  const result = await course.save();
  console.log(result);
}

// Get courses
async function getCourses() {
  const courses = await Course
    .find()
    // .find({ author: 'Mosh', isPublished: true })
    // .find({ author: 'Mosh', price: { $gte: 10, $lte: 20 } }) // query courses with prices between 10 and 20
    //.find({ author: 'Mosh', price : { $in : [10, 20, 30]}) // query courses with prices 10, 20 or 30
    //.find()
    //.or([{ author: 'Mosh' }, { isPublished: true }])
    //.and([{ author: 'Mosh' }, { isPublished: true }])
    // .limit(10)
    // .sort({ name: 1 })
    .select({ name: 1});
  console.log(courses);
}

// Get count of courses
async function getCountOfCourses() {
  const coursesCount = await Course
    //.find({ author: 'Mosh', isPublished: true })
    .find()
    .countDocuments();
  console.log(coursesCount);
}

// pagination
// /api/courses?pageNumber=2&pageSize=10
async function getCoursesInPage(pageNumber, pageSize) {
  const courses = await Course.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);
  console.log(courses);
}

async function updateCourseFirstApproach(id) {
  // first approach: Query first
  // findById()
  // Modify its properties
  // save()
  const course = await Course.findById(id);
  if (!course) return;

  course.isPublished = false;
  course.author = 'Mutaz';
  // or
  // course.set({
  //   isPublished: false,
  //   author:'Mutaz'
  // });

  const res = await course.save();
  console.log(res);
}

async function updayeCourseSecondApproach(id) {
  // second approach: update first
  // update directly
  // optionally: get the updated documnet
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: 'Jason',
        isPublished: true
      }
    },
    { new: true }
  );

  console.log(course);
}

async function deleteCourse(id) {
  const course = await Course.findByIdAndDelete(id);
  console.log(course);
}

// createCourse();
// getCourses();
// getCountOfCourses();
// getCoursesInPage(1, 2);
// updateCourseFirstApproach('5d7be96c6d3123296407cfdc');
// updayeCourseSecondApproach('5d7be96c6d3123296407cfdc')
// deleteCourse('5d7bef90e9a1bf15385eacd7');
createAuthor('Mosh','My bio','My website');
// createCourse('Node Course', 'authorId');
// getCourses();

// add a port so server can listening on
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
