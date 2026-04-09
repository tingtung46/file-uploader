import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import indexRouter from "./routes/indexRouter.js";
import session from "express-session";
import passport from "./config/passport.js";
import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
app.use(passport.session());

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(3000);
