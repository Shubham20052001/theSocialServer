"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const postRouter = (0, express_1.Router)();
exports.postRouter = postRouter;
postRouter.get("/", post_controller_1.PostController.fetchPosts);
postRouter.post("/add/:useremail", post_controller_1.PostController.addPost);
