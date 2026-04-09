import { body } from "express-validator";

const validateUser = [
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password length minimal 5 characters"),
  body("passwordConfirmation").custom((value, { req }) => {
    const matchedPassword = value === req.body.password;

    if (!matchedPassword) {
      throw new Error("Password doesn't match");
    } else {
      return true;
    }
  }),
];

export default validateUser;
