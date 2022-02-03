const jwtSecret = "your_jwt_secret";

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport");

let generateJWTToken = user => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: "7d",
    algorithm: "HS256"
  });
};


/*module.exports = (app) => {
  app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    // If authentication is successful, this code gets executed
    let token = generateJWTToken((req.user).toJSON()); // `req.user` contains the authenticated user
    return res.json({ user: req.user, token: token });
  });
}*/

module.exports = router => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user
        });
      }
      req.login(user, { session: false }, error => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
