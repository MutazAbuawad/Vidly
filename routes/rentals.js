const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
// use fawn package to implement the transactions at db
const fawn = require("fawn");

fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  //   rental = await rental.save();

  //   movie.numberInStock--;
  //   movie.save();
  try {
    new fawn.Task()
      .save("rentals", rental)// passed the collection name as in db
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: {
            numberInStock: -1
          }
        }
      )
      .run();

    res.send(rental);
  } catch (err) {
    res.status(500).send("Something Failed..", err.message);
  }
});

module.exports = router;
