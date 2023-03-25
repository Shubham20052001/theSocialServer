import { Request, Response } from "express";
import { PostRepository } from "../database/repository/post.repository";

export class PostController {
  static async addPost(req: Request, res: Response) {
    await PostRepository.addPost(req, res);
  }

  static async fetchPosts(req: Request, res: Response) {
    await PostRepository.fetchPosts(req, res);
  }
}
