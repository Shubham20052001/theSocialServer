"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyRouter = void 0;
const express_1 = require("express");
const story_controller_1 = require("../controllers/story.controller");
const storyRouter = (0, express_1.Router)();
exports.storyRouter = storyRouter;
storyRouter.get("/", story_controller_1.StoryController.fetchPosts);
storyRouter.get("/user/:useremail", story_controller_1.StoryController.fetchStoryByUser);
storyRouter.get("/other/:useremail", story_controller_1.StoryController.fetchStoryOfOtherPeople);
//! Post
storyRouter.post("/add/:useremail", story_controller_1.StoryController.addStory);
//! Delete
storyRouter.delete("/delete/:story_id", story_controller_1.StoryController.deleteStory);
