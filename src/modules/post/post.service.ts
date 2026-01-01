import { Post, PostStatus, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPost = async (payload: {
  search: string | undefined;
  tag: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
}) => {
  const addCondition: Prisma.PostWhereInput[] = [];
  if (payload.search) {
    addCondition.push({
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: payload.search as string,
          },
        },
      ],
    });
  }
  if (payload.tag.length > 0) {
    addCondition.push({
      tags: {
        hasEvery: payload.tag as string[],
      },
    });
  }
  if (typeof payload.isFeatured === "boolean") {
    addCondition.push({
      isFeatured: payload.isFeatured,
    });
  }
  if (payload.status) {
    addCondition.push({
      status: payload.status,
    });
  }
  if (payload.authorId) {
    addCondition.push({
      authorId: payload.authorId,
    });
  }
  const result = await prisma.post.findMany({
    where: {
      AND: addCondition,
    },
  });
  return result;
};

export const postServices = {
  createPost,
  getAllPost,
};
