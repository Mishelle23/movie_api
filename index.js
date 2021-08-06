const express = require("express");

morgan = require("morgan");
uuid = require("uuid");
bodyParser = require("body-parser");

const app = express();

app.use(morgan("common"));

app.use(bodyParser.json());

app.use(express.static("public"));

// JSON Object 10 Top Movies
let movies = [
  {
    title: "The Age of Adaline",
    actor: "Blake Lively",
    director: "Lee Toland Krieger",
    genre: "romance"
  },
  {
    title: "The Impossible",
    actor: "Naomi Watts",
    director: "J A Bayona",
    genre: "true story"
  },
  {
    title: "Sweet November",
    actor: "Charlize Theron",
    director: "Pat OConnor",
    genre: "romance"
  },
  {
    title: "Sully",
    actor: "Tom Hanks",
    director: "Clint Eastwood",
    genre: "true story"
  },
  {
    title: "Into the Wild",
    actor: "Emile Hirsch",
    director: "Sean Penn",
    genre: "true story"
  },
  {
    title: "The Grey",
    actor: "Liam Neeson",
    director: "Joe Carnahan",
    genre: "thriler"
  },
  {
    title: "Arctic",
    actor: "Mads Mikkelsen",
    director: "Joe Penna",
    genre: "true story"
  },
  {
    title: "Jungle",
    actor: "Daniel Radcliffe",
    director: "Greg McLean",
    genre: "true story"
  },
  {
    title: "Little Women",
    actor: "Florence Pugh",
    director: "Greta Gerwig",
    genre: "classic"
  },
  {
    title: "Patch Adams",
    actor: "Robin Williams",
    director: "Tom Shadyac",
    genre: "true story"
  }
];

// GET requests
app.get("/", (req, res) => {
  res.send("Let Me Present My First Movie API");
});

// Returning a list of ALL movies to the user
app.get("/movies", (req, res) => {
  res.json(movies);
});

// Returning data (description, genre, director) about a single movie
app.get("/movies/:title", (req, res) => {
  res.json(
    movies.find(movie => {
      return movie.title === req.params.title;
    })
  );
});

// Return data about a genre
app.get("/genres/:title", (req, res) => {
  res.json(
    movies.find(genre => {
      return genre.title === req.params.title;
    })
  );
});

// Returning data about a director
app.get("/directors/:director", (req, res) => {
  res.json(
    movies.find(director => {
      return director.director === req.params.director;
    })
  );
});

app.get("/actors/:title", (req, res) => {
  res.json(
    movies.find(actor => {
      return actor.title === req.params.title;
    })
  );
});

// Allowing new users to register
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = "Missing name in request body";
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Allowing the user to update their user info (username)
app.put("/users/:username", (req, res) => {
  let userName = users.find(username => res.send("User was not found."));
});

// Allowing the user to add a movie to the favourites list
app.put("/users/movies/:favorites", (req, res) => {
  let userFavorite = movies.find(movie => res.send("Movie added to favorites"));
});

// Allowing the user to remove a movie from the favorites list
app.delete("/users/movies/:favorites", (req, res) => {
  let userFavorite = movies.find(movie =>
    res.send("Movie has been deleted from favorites")
  );
});

// Allowing already existing user to unregister
app.delete("/users/:username", (req, res) => {
  let deRegister = users.find(user =>
    res.send("user / details have been removed")
  );
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
// Listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
