import express, { Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { USERROLE } from "../../middlewere/auth";

const router = express.Router();

router.post(
  "/",
  auth(USERROLE.ADMIN, USERROLE.USER),
  CommentController.createComment
);
export const CommentRouter: Router = router;
