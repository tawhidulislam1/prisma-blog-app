import express, { Router } from "express";
import { PostController } from "./post.controller";
import auth, { USERROLE } from "../../middlewere/auth";

const router = express.Router();

router.get("/", PostController.getAllPost);
router.get("/stats", auth(USERROLE.ADMIN), PostController.getStats);
router.get(
  "/getMyPosts",
  auth(USERROLE.USER, USERROLE.ADMIN),
  PostController.getMyPosts
);
router.get("/:postId", PostController.getPostById);
router.post(
  "/",
  auth(USERROLE.USER, USERROLE.ADMIN),
  PostController.createPost
);
router.patch(
  "/:postId",
  auth(USERROLE.USER, USERROLE.ADMIN),
  PostController.updatePost
);
router.delete(
  "/:postId",
  auth(USERROLE.USER, USERROLE.ADMIN),
  PostController.postDelete
);

export const PostRouter: Router = router;
