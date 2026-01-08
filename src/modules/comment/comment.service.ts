import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });
  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }
  return await prisma.comment.create({
    data: payload,
  });
};
const getCommentById = async (commentId: string) => {
  return await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};

const getCommentByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const commentDelete = async (id: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: id,
      authorId,
    },
    select: {
      id: true,
    },
  });
  if (!commentData) {
    throw new Error("Your have no comment");
  }
  const result = await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
  return result;
};
export const CommentService = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  commentDelete,
};
