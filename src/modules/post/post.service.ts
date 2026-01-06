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
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
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
  const allPost = await prisma.post.findMany({
    take: payload.limit,
    skip: payload.skip,
    where: {
      AND: addCondition,
    },
    orderBy: {
      [payload.sortBy]: payload.sortOrder,
    },
  });
  const total = await prisma.post.count({
    where: {
      AND: addCondition,
    },
  });
  return {
    data: allPost,
    pagination: {
      total,
      page: payload.page,
      limit: payload.limit,
      totalPages: Math.ceil(total / payload.limit),
    },
  };
};
const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    return postData;
  });
};
export const postServices = {
  createPost,
  getAllPost,
  getPostById,
};
