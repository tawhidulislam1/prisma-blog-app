import express, { Router } from "express";
import { CommentController } from "./comment.controller";
import auth, { USERROLE } from "../../middlewere/auth";

const router = express.Router();

router.get("/:commentId", CommentController.getCommentById);
router.get("/author/:authorId", CommentController.getCommentByauthor);
router.post(
  "/",
  auth(USERROLE.ADMIN, USERROLE.USER),
  CommentController.createComment
);
router.delete(
  "/:id",
  auth(USERROLE.ADMIN, USERROLE.USER),
  CommentController.commentDelete
);
export const CommentRouter: Router = router;
