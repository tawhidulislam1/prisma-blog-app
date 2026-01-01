import { Request, Response } from "express";
import { postServices } from "./post.service";
import { success } from "better-auth/*";

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

export const PostController = {
  createPost,
};
