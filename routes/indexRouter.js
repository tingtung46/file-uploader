import { Router } from "express";
import {
  welcomeGet,
  signUpGet,
  signUpPost,
  logInGet,
  logInPost,
  dashboardGet,
  logOutGet,
} from "../controllers/pageController.js";
import isAuth from "../controllers/authController.js";
import {
  uploadFilePost,
  createFolderPost,
} from "../controllers/formController.js";

const indexRouter = Router();

indexRouter.get("/", welcomeGet);

indexRouter.get("/sign-up", signUpGet);
indexRouter.post("/sign-up", signUpPost);

indexRouter.get("/log-in", logInGet);
indexRouter.post("/log-in", logInPost);

indexRouter.get("/dashboard", isAuth, dashboardGet);

indexRouter.post("/upload-file", uploadFilePost);

indexRouter.post("/create-folder", createFolderPost);

indexRouter.get("/log-out", logOutGet);

export default indexRouter;
