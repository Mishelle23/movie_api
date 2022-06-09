// express framework loaded
const express = require("express");
const bodyParser = require("body-parser");
const auth = require('./auth.js');
const uuid = require("uuid");
// input fields validation
const { check, validationResult } = require("express-validator");
const morgan = require("morgan");
const app = express();
// Mongoose package is required and Mongoose Models created in models.js
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

// connecting to the DB in use
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// implementing passport module, imports file passport.js
const passport = require("passport");
require("./passport");

// cors controls domains which are allowed to use the API
const cors = require("cors");
app.use(cors());
auth(app);

/*CORS policy to be initiated*/
/*let allowedOrigins = ['http://localhost:1234', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn't found on the list of allowed origins
      let message = "The CORS policy for this application doesn't allow access from origin " + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));*/



app.get("/", (req, res) => {
  res.send("Let Me Present My First Movie Database");
});

/**
 * GET request: provides a list of all movies
 * @returns array of movie objects
 * @requires passport
 */
app.get(
  "/movies", passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then(movies => {
        res.status(201).json(movies);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: ", err);
      });
  }
);

/**
 * GET request: provides information about a single movie description, director, genre and image
 * @param Title
 * @returns movie object
 * @requires passport
 */
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title }) // finding a movie via title
      .then(movie => {
        res.json(movie);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: ", err);
      });
  }
);

/**
 * GET request: Returning data of all directors
 * @returns all directors info
 * @requires passport
 */
app.get(
  "/directors",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Directors.find()
      .then(director => {
        res.status(200).json(director);
      })
      .catch(err => {
        console.error(err);
        res.status(500).sned("Error: " + err);
      });
  }
);

/**
 * GET request: Returning the director's data by name
 * @param Name of chosen director
 * @returns director object
 * @requires passport
 */
app.get(
  "/directors/:Name",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Directors.findOne({
      "Director.Name": req.params.Name
    })
      .then(director => {
        res.json(director);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * GET request: Returning data of all genres
 * @returns genres information
 * @requires passport
 */
app.get(
  "/genre",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Genres.find()
      .then(genre => {
        res.status(200).json(genre);
      })
      .catch(err => {
        console.error(err);
        res.status(500).sned("Error: " + err);
      });
  }
);

/**
 * GET request: Returning data of a single genre by name
 * @param Name (genre)
 * @returns genre object
 * @requires passport
 */
app.get(
  "/genre/:Name",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Genres.findOne({
      Name: req.params.Name
    })
      .then(genre => {
        res.json(genre);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * GET request: Returning data of all users
 * @returns array of user objects
 * @requires passport
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then(users => {
        res.status(201).json(users);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * GET request: Returning data of a single user by name (username)
 * @param Username
 * @returns object of a user
 * @requires passport
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * POST request: User is able to register via Password, Username and Email
 * @returns object of new user
 */
app.post(
  "/users",
  // Logic of user validation
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non aplhanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required")
      .not()
      .isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail()
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);  // hashedPassword is created from entered Password
    Users.findOne({ Username: req.body.Username })
      .then(user => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then(user => {
              res.status(201).json(user);
            })
            .catch(error => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * PUT request: User can update thier user information
 * @param Username
 * @returns object of an updated user
 * @requires passport 
 */
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },  // Locate user via username
      {
        $set: {                           // User information to be updated
          Username: req.body.Username,
          Password: req.body.Password,    // Retains hashed password
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Delete request: user can cancel registration
 * @param Username
 * @returns message that process has been successfull
 * @requires passport
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(user => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found.");  // return success message if user was found otherwise return error
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * POST reuest: Adding a movie to the user's favorites
 * @param Username
 * @param MovieID
 * @returns object of a user
 * @requires passport
 */
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete a movie from the favorite list of an user

app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Error handler

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something went wrong!");
});
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port" + port);
});
