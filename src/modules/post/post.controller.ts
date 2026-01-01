import { Request, Response } from "express";
import { postServices } from "./post.service";
import { success } from "better-auth/*";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        details: "Your are to able to create",
      });
    }
    const result = await postServices.createPost(req.body, user.id as string);
    res.status(201).json({ result });
  } catch (error) {
    res.status(400).json({
      error: "post creation failed",
      details: error,
    });
  }
};
const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tag = req.query.tag ? (req.query.tag as string).split(",") : [];
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
      : undefined;
    const status = req.query.status as PostStatus | undefined;
    const authorId = req.query.authorId as string | undefined;
    const result = await postServices.getAllPost({
      search: searchString,
      tag,
      isFeatured,
      status,
      authorId,
    });
    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      error: "post found failed",
      details: error,
    });
  }
};
export const PostController = {
  createPost,
  getAllPost,
};
