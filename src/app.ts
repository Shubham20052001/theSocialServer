import express from "express";
import { authrouter } from "./routes/authentication.routes";
import config from "./ormconfig";
import "reflect-metadata";
import { postRouter } from "./routes/post.routes";
import { storyRouter } from "./routes/story.routes";

const app = express();
const port = process.env.PORT || 8000;

console.log("before db connection");

config.initialize().then(async (connection) => {
  if (connection.isInitialized) {
    console.log("Postgres Connected!");
  }
  app.set("port", port);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get("/", (req, res) => res.send("The Social Server"));

  //* Authentication route
  app.use("/user", authrouter);

  //* Posts route
  app.use("/post", postRouter);

  //* Story route
  app.use("/story", storyRouter);

  app.listen(app.get("port"), () => {
    console.log(`The server is running at port ${app.get("port")}`);
  });
});
