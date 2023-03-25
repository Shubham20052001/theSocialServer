import { Router } from "express";
import { StoryController } from "../controllers/story.controller";

const storyRouter = Router();

storyRouter.get("/", StoryController.fetchPosts);
storyRouter.get("/user/:useremail", StoryController.fetchStoryByUser);
storyRouter.get("/other/:useremail", StoryController.fetchStoryOfOtherPeople);

//! Post
storyRouter.post("/add/:useremail", StoryController.addStory);

//! Delete
storyRouter.delete("/delete/:story_id", StoryController.deleteStory);

export { storyRouter };
