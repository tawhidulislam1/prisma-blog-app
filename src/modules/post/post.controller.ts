import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postServices.createPost(req.body);
    res.status(201).json({result});
  } catch (error) {
    res.status(400).json({
      error: "post creation failed",
      details: error,
    });
  }
};

export const PostController = {
  createPost,
};
