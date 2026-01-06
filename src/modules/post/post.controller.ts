import { Request, Response } from "express";
import { postServices } from "./post.service";
import { success } from "better-auth/*";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../halpers/paginationSortingHelper";

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
    // const page = Number(req.query.page ?? 1);
    // const limit = Number(req.query.limit ?? 10);
    // const skip = (page - 1) * limit;
    // const sortBy = req.query.sortBy as string | undefined;
    // const sortOrder = req.query.sortOrder as string | undefined;
    const { page, skip, sortBy, sortOrder, limit } = paginationSortingHelper(
      req.query
    );

    const result = await postServices.getAllPost({
      search: searchString,
      tag,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortOrder,
      sortBy,
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
const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      throw new Error("post id is requerid");
    }
    const result = await postServices.getPostById(postId);
    res.status(201).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      error: "post get failed",
      details: error,
    });
  }
};
export const PostController = {
  createPost,
  getAllPost,
  getPostById,
};
