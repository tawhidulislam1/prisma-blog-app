import { commentStatus } from "./../../../generated/prisma/enums";
import { Post, PostStatus, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { USERROLE } from "../../middlewere/auth";

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
    include: {
      _count: {
        select: { comments: true },
      },
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
      include: {
        comments: {
          where: {
            parentId: null,
            staus: commentStatus.approved,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });
};

const getMyPosts = async (authorId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });
  return await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updatePost = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: Boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("your are not owner in this post");
  }
  if (!isAdmin) {
    delete data.isFeatured;
  }
  const result = await prisma.post.update({
    where: {
      id: postData.id,
    },
    data,
  });
  return result;
};

const postDelete = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("your are not owner in this post");
  }

  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      publishedPost,
      draftPost,
      archivedPost,
      totalComments,
      approvedComment,
      totalUsers,
      adminCount,
      userCount,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({ where: { status: PostStatus.published } }),
      await tx.post.count({ where: { status: PostStatus.draft } }),
      await tx.post.count({ where: { status: PostStatus.archived } }),
      await tx.comment.count(),
      await tx.comment.count({ where: { staus: commentStatus.approved } }),
      await tx.user.count(),
      await tx.user.count({ where: { role: "ADMIN" } }),
      await tx.user.count({ where: { role: "USER" } }),
      await tx.post.aggregate({
        _sum: { views: true },
      }),
    ]);

    return {
      totalPosts,
      publishedPost,
      archivedPost,
      draftPost,
      totalComments,
      approvedComment,
      totalUsers,
      adminCount,
      userCount,
      totalViews: totalViews._sum.views,
    };
  });
};
export const postServices = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  postDelete,
  getStats,
};
