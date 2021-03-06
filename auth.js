const jwtSecret = "your_jwt_secret";

const jwt = require("jsonwebtoken"),
  passport = require("passport");

// local passport file is required
require("./passport");


/**
 * JWT is created using HS256 algorithm, expires in 7 days
 * @param {object} user 
 * @returns object of a user, token information and jwt
 */
let generateJWTToken = user => {
  return jwt.sign(user, jwtSecret, {
    // username which is included in JWT
    subject: user.Username,
    // token will expire in 7 days
    expiresIn: "7d",
    algorithm: "HS256"
  });
};



/**
 * generates jwt when user logs in
 * @function generateJWTToken
 * @param {*} router
 * @returns jwt of a user (object)
 * @requires passport
 */
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
        // create jwt of existing user
        let token = generateJWTToken(user.toJSON());
        // created token is returned
        return res.json({ user, token });
      });
    })(req, res);
  });
};
