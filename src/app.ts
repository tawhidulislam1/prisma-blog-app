import express, { Application } from "express";
import { PostRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";

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

app.get("/", (req, res) => {
  res.send("hello world");
});

export default app;
