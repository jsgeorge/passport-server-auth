const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");

// exports.auth = function(req, res, next) {
//   res.status(200).json({
//     isAuth: true
//   });
// };
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide emaill and password" });
  }

  //see if a user with given email exits
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(422).send({ err: "Email already in use" });
    }
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      res.json({
        token: tokenForUser(user)
      });
    });
  });
};

exports.login = function(req, res, next) {
  //user has already had credental auth'd
  //just need a token
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide emaill and password" });
  }

  res.send({ token: tokenForUser(req.user) });
};

// exports.login = function(req, res, next) {
//   const email = req.body.email;
//   const password = req.body.password;
//   User.findOne({ email: email }, (err, user) => {
//     if (!user)
//       return res.json({
//         loginSuccess: false,
//         message: "Auth failed, email not found"
//       });

//     user.comparePassword(password, (err, isMatch) => {
//       if (!isMatch)
//         return res.json({
//           loginSuccess: false,
//           message: "Wrong password"
//         });
//       // res.status(200).json({
//       //   loginSuccess: true
//       // });
//       user.generateToken((err, user) => {
//         if (err) {
//           return res.status(400).send(err);
//         }
//         res
//           .cookie("token", user.cookie)
//           .status(200)
//           .json({
//             loginSuccess: true,
//             token: user.token
//           });
//       });
//     });
//   });
// };
