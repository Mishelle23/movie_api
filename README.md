# movie_api

## Description

This application was created for the learning puropse of Career Foundry Full Stack Web Development course

### Functionality of the application

User can access a database to receive information about movies of my personal choice. Information consists of story description, director and genre.
User can also register, update profile details and save or delete favorite movies list.

## Instalation and running of the application

1. Dowload the repository or you may clone it also

` https://github.com/Mishelle23/movie_api.git`

2. Install mongodb

` npm install mongodb`

3. Connect with your own MongoDB, environment variable is defined via CONNECTION_URI

5. Start the server

`npm run start`

## How is application implemented

The application need to be registered at [https://safe-coast-49930.herokuapp.com/users]
and also [https://safe-coast-49930.herokuapp.com/login] for the JWT token to be obtained.

## Technical Requirements

- node.js 
- MongoDB
- RESTful architecture
- Express
- database: created with MongoDB
- business logic layer: created with use of Mongoose
- middleware modules
- API returning movies as JSON
- testing with use of Postman
- security: user authetication, authorization and validation
- deploy on Heroku
- deploy on GitHub 

## Creation of non-relational database MongoDB

- structure the database into two collections ( movies and users ) using database schema diagram
- install mongo shell
- using Mongo Shell and CRUD operations create database
- create several documents in movies collection including embedded documents for genre and director

## Business Logic

The database is linked to the server using Mongoose to build Business Logic Layer

Instructions:

- install Mongoose
- install dependencies: bcrypt, JWT (json web token )
- configure schema for collections ( users, movies )
- create Models: models.js file
- export models to index.js
- query mongoose models using CRUD operations
- integrate mongoose with REST API
- authentication methods to be applied (jwt, local)
- test endpoints using Postman

## Data security

### Authenticate in Express and Node.js via Passport

- login request requires authentication ( basic HTTP )
- generate JWT token by implementing login query

### Security measures for backend

- implement CORS and set it to Allow All Origins
- implement bcrypt for password hashing
- connection URI gets hidden by adjustment of environment variable



