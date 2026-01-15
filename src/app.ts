import express, { Application } from "express";
import { PostRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { CommentRouter } from "./modules/comment/comment.router";
import errorHandler from "./middlewere/globalErrorHandler";
import { notFound } from "./middlewere/notFount";

const app: Application = express();

app.use(
  cors({
    origin: process.env.AUTH_URL,
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/post", PostRouter);
app.use("/comment", CommentRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});
app.use(notFound);
app.use(errorHandler);
export default app;
