const passport = require("passport");
const User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const config = require("../config");

const LocalStrategy = require("passport-local");

//creat local strategy
const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy({ usernameField: "email" }, function(
  email,
  password,
  done
) {
  //varify email& passord, call done with the user
  //if it is correct email and pasword
  //otherwise call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    //compare passords - eal to user password
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
});

//setup option for JWT stragtey
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

//create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //see if the userid in payload exists in db call done
  // if it does then call done in objecct
  // else call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});
//tell passport to use this stategy
passport.use(jwtLogin);
passport.use(localLogin);
