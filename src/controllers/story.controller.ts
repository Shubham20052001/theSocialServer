import { Request, Response } from "express";
import { StoryRepository } from "../database/repository/story.repository";

export class StoryController {
  static async addStory(req: Request, res: Response) {
    await StoryRepository.addStory(req, res);
  }

  static async fetchPosts(req: Request, res: Response) {
    await StoryRepository.fetchStory(req, res);
  }

  static async fetchStoryByUser(req: Request, res: Response) {
    await StoryRepository.fetchStoryByUser(req, res);
  }

  static async fetchStoryOfOtherPeople(req: Request, res: Response) {
    await StoryRepository.fetchStoryOfOtherPeople(req, res);
  }

  static async deleteStory(req: Request, res: Response) {
    await StoryRepository.deleteStory(req, res);
  }
}
