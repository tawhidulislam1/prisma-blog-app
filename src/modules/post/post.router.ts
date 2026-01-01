import { email } from "./../../../node_modules/zod/src/v4/core/regexes";
import express, { NextFunction, Request, Response, Router } from "express";
import { PostController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";
import auth, { USERROLE } from "../../middlewere/auth";

const router = express.Router();

router.get("/", PostController.getAllPost);
router.post("/", auth(USERROLE.USER), PostController.createPost);

export const PostRouter: Router = router;
