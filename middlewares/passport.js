const LocalStrategy = require("passport-local").Strategy;
const { UserService } = require("../services");
const bcrypt = require("bcrypt");
const res = require("express/lib/response");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserService.findOne("email", email);
          if (!user) {
            return done(null, false, {
              message: "That email is not registered.",
            });
          }

          await user.comparePassword(password, function (err, isMatch) {
            if (err) done(err);
            if (!isMatch) {
              return done(null, false, { message: "Password incorrect" });
            }
            return done(null, user);
          });
        } catch (err) {
          return res.status(err.cod).send(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    console.log(id);
    const user = await UserService.find(id);
    if (!user) {
      done(err);
    }
    done(null, user);
    console.log(user);
  });
};