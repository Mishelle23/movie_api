const express = require("express");
morgan = require("morgan");

const app = express();

let topTen = [
  //1
  {
    title: "The Age of Adaline"
  },

  //2
  {
    title: "The Impossible"
  },

  //3
  {
    title: "Sweet November"
  },

  //4
  {
    title: "Sully"
  },

  //5
  {
    title: "Into the Wild"
  },

  //6
  {
    title: "The Grey"
  },

  //7
  {
    title: "Arctic"
  },

  //8
  {
    title: "Jungle"
  },

  //9
  {
    title: "Little Women"
  },

  //10
  {
    title: "Patch Adams"
  }
];

app.use(morgan("common"));
app.use(express.static("public"));

// GET requests
app.get("/", (req, res) => {
  res.send("My movie API");
});

app.get("/movies", (req, res) => {
  res.json(topTen);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something Broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
