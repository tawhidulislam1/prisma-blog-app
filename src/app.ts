import express, { Application } from "express";
import { PostRouter } from "./modules/post/post.router";
const app: Application = express();
app.use(express.json());

app.use("/post", PostRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});

export default app;
