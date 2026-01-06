
import express, { Router } from "express";
import { PostController } from "./post.controller";
import auth, { USERROLE } from "../../middlewere/auth";

const router = express.Router();

router.get("/", PostController.getAllPost);
router.get("/:postId", PostController.getPostById);
router.post("/", auth(USERROLE.USER), PostController.createPost);

export const PostRouter: Router = router;
