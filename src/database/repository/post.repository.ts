import { Request, Response } from "express";
import datasource from "../../ormconfig";
import { PostEntity } from "../entity/post.entity";
import { UserRepository } from "./user.repository";

export const PostRepository = datasource.getRepository(PostEntity).extend({
  async addPost(req: Request, res: Response) {
    let { useremail } = req.params;
    let { post_title, post_images, post_comments, post_likes } = req.body;

    let user = await UserRepository.findOneBy({ useremail });

    let postEntity = new PostEntity();
    postEntity.post_user = user!;
    postEntity.post_title = post_title;
    postEntity.post_images = post_images;
    postEntity.post_comments = post_comments;
    postEntity.post_likes = post_likes;

    const PostRepository = datasource.getRepository(PostEntity);
    PostRepository.save(postEntity)
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

  async fetchPosts(req: Request, res: Response) {
    try {
      let post = await this.createQueryBuilder("post")
        .leftJoinAndSelect("post.post_user", "users")
        .select()
        .getMany();

      if (post != undefined) {
        return res.send({
          code: 200,
          data: post,
          received: true,
        });
      }
    } catch (error) {
      if (error != undefined) {
        return res.send({
          code: 401,
          data: null,
          received: false,
        });
      }
    }
  },

  async deletePost(req: Request, res: Response) {
    try {
      let { post_id } = req.params;
      await this.createQueryBuilder("post")
        .delete()
        .from(PostEntity)
        .where("post.post_id = :post_id", { post_id })
        .execute()
        .then((data: any) => {
          console.log(data);
          let isAffected = data.effected;

          if (isAffected > 0) {
            return res.send({
              code: 204,
              data: "Post is deleted",
              deleted: true,
            });
          } else {
            return res.send({
              code: 401,
              data: "Post is not deleted",
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
