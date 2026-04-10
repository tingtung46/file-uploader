import { prisma } from "../lib/prisma.js";
import validateUser from "../config/validation.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import passport from "passport";

const welcomeGet = (req, res) => {
  res.render("index");
};

const signUpGet = (req, res) => {
  res.render("sign-up");
};

const signUpPost = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", { errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
        },
      });

      res.redirect("/log-in");
    } catch (err) {
      next(err);
    }
  },
];

const logInGet = (req, res) => {
  res.render("log-in");
};

const logInPost = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    } else if (!user) {
      return res
        .status(400)
        .render("log-in", { err: "Check email and password again" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      res.redirect("/dashboard");
    });
  })(req, res, next);
};

const dashboardGet = (req, res) => {
  res.render("dashboard");
};

const logOutGet = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);

    res.render("log-out");
  });
};

export {
  welcomeGet,
  signUpGet,
  signUpPost,
  logInGet,
  logInPost,
  dashboardGet,
  logOutGet,
};
