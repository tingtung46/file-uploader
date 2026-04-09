import { Router } from "express";
import {
  welcomeGet,
  signUpGet,
  signUpPost,
  logInGet,
} from "../controllers/pageController.js";

const indexRouter = Router();

indexRouter.get("/", welcomeGet);

indexRouter.get("/sign-up", signUpGet);
indexRouter.post("/sign-up", signUpPost);

indexRouter.get("/log-in", logInGet);

export default indexRouter;
