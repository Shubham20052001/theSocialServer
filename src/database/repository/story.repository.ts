import { Request, Response } from "express";
import datasource from "../../ormconfig";
import { PostEntity } from "../entity/post.entity";
import { StoryEntity } from "../entity/story.entity";
import { UserRepository } from "./user.repository";

export const StoryRepository = datasource.getRepository(StoryEntity).extend({
  async addStory(req: Request, res: Response) {
    let { useremail } = req.params;
    let { story_assets } = req.body;

    let user = await UserRepository.findOneBy({ useremail });

    let storyEntity = new StoryEntity();
    storyEntity.story_user = user!;
    storyEntity.story_assets = story_assets;
    const StoryRepository = datasource.getRepository(StoryEntity);
    await StoryRepository.save(storyEntity)
      .then((data: any) => {
        if (data != undefined) {
          return res.send({
            code: 201,
            added: true,
          });
        }
      })
      .catch((error: any) => {
        if (error != undefined) {
          return res.send({
            code: 401,
            added: false,
          });
        }
      });
    // postEntity
    //   .save()
    //   .then((data: any) => {
    //     if (data != undefined) {
    //       return res.send({
    //         code: 201,
    //         added: true,
    //       });
    //     }
    //   })
    //   .catch((error: any) => {
    //     if (error != undefined) {
    //       return res.send({
    //         code: 401,
    //         added: false,
    //       });
    //     }
    //   });
  },

  async fetchStory(req: Request, res: Response) {
    try {
      let stories = await this.createQueryBuilder("story")
        .leftJoinAndSelect("story.story_user", "users")
        .select()
        .getMany();

      if (stories != undefined) {
        return res.send({
          code: 200,
          data: stories,
        });
      }
    } catch (error) {
      if (error) {
        console.log(error);
        return res.send({
          code: 401,
          data: "Something went wrong.",
        });
      }
    }
  },

  async fetchStoryByUser(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let story = await this.createQueryBuilder("story")
        .leftJoinAndSelect("story.story_user", "users")
        .select()
        .where("users.useremail = :useremail", { useremail })
        .getMany();

      if (story != undefined) {
        return res.send({
          code: 200,
          data: story,
        });
      }
    } catch (error) {
      if (error) {
        console.log(error);
        return res.send({
          code: 401,
          data: "Something went wrong.",
        });
      }
    }
  },

  async fetchStoryOfOtherPeople(req: Request, res: Response) {
    let { useremail } = req.params;
    try {
      let story = await this.createQueryBuilder("story")
        .leftJoinAndSelect("story.story_user", "users")
        .select()
        .where("users.useremail != :useremail", { useremail })
        .getMany();

      if (story != undefined) {
        return res.send({
          code: 200,
          data: story,
        });
      }
    } catch (error) {
      if (error) {
        console.log(error);
        return res.send({
          code: 401,
          data: "Something went wrong.",
        });
      }
    }
  },

  async deleteStory(req: Request, res: Response) {
    try {
      let { story_id } = req.params;
      await this.createQueryBuilder("story")
        .delete()
        .from(StoryEntity)
        .where("story.story_id = :story_id", { story_id })
        .execute()
        .then((data: any) => {
          console.log(data);
          let isAffected = data.affected;

          if (isAffected > 0) {
            return res.send({
              code: 204,
              data: "Story is deleted",
              deleted: true,
            });
          } else {
            return res.send({
              code: 401,
              data: "Story is not deleted",
              deleted: false,
            });
          }
        })
        .catch((error: any) => {
          if (error != undefined) {
            console.log(error);
            return res.send({
              code: 401,
              data: null,
              deleted: false,
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  },
});
