import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({
      error: "post creation failed",
      details: error,
    });
  }
};
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await CommentService.getCommentById(commentId as string);
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({
      error: "comment found failed",
      details: error,
    });
  }
};
const getCommentByauthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await CommentService.getCommentByAuthor(authorId as string);
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({
      error: "comment found failed",
      details: error,
    });
  }
};
const commentDelete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const result = await CommentService.commentDelete(
      id as string,
      user?.id as string
    );
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({
      error: "comment deleted failed",
      details: error,
    });
  }
};
const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const user = req.user;
    const result = await CommentService.updateComment(
      user?.id as string,
      commentId as string,
      req.body
    );
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({
      error: "comment update failed",
      details: error,
    });
  }
};
const moderateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await CommentService.moderateComment(
      commentId as string,
      req.body
    );
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({
      error: (error as Error).message || "comment update failed",
      details: error,
    });
  }
};
export const CommentController = {
  createComment,
  getCommentById,
  getCommentByauthor,
  commentDelete,
  updateComment,
  moderateComment,
};
