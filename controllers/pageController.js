import { prisma } from "../lib/prisma.js";
import validateUser from "../config/validation.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

const welcomeGet = (req, res) => {
  res.render("index");
};

const signUpGet = async (req, res) => {
  const users = await prisma.user.findMany();
  console.log(JSON.stringify(users, null, 2));

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

export { welcomeGet, signUpGet, signUpPost, logInGet };
