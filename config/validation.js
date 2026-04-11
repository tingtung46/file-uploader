import { body } from "express-validator";
import { prisma } from "../lib/prisma.js";

const validateUser = [
  body("email").custom(async (value) => {
    const user = await prisma.user.findUnique({
      where: {
        email: value,
      },
    });

    if (user) {
      throw new Error("E-mail already in use");
    }

    return true;
  }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password length minimal 5 characters"),
  body("passwordConfirmation").custom((value, { req }) => {
    const matchedPassword = value === req.body.password;

    if (!matchedPassword) {
      throw new Error("Password doesn't match");
    }

    return true;
  }),
];

export default validateUser;
