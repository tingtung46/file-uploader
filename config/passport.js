import passport from "passport";
import LocalStrategy from "passport-local/lib/strategy.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

passport.use(
  new LocalStrategy(customFields, async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: username },
      });
      const match = await bcrypt.compare(password, user.password);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        files: true,
        folders: true,
      },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
