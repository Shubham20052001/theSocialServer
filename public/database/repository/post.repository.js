"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const ormconfig_1 = __importDefault(require("../../ormconfig"));
const post_entity_1 = require("../entity/post.entity");
const user_repository_1 = require("./user.repository");
exports.PostRepository = ormconfig_1.default.getRepository(post_entity_1.PostEntity).extend({
    addPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { useremail } = req.params;
            let { post_title, post_images, post_comments, post_likes } = req.body;
            let user = yield user_repository_1.UserRepository.findOneBy({ useremail });
            let postEntity = new post_entity_1.PostEntity();
            postEntity.post_user = user;
            postEntity.post_title = post_title;
            postEntity.post_images = post_images;
            postEntity.post_comments = post_comments;
            postEntity.post_likes = post_likes;
            const PostRepository = ormconfig_1.default.getRepository(post_entity_1.PostEntity);
            PostRepository.save(postEntity)
                .then((data) => {
                if (data != undefined) {
                    return res.send({
                        code: 201,
                        added: true,
                    });
                }
            })
                .catch((error) => {
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
        });
    },
    fetchPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let post = yield this.createQueryBuilder("post")
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
            }
            catch (error) {
                if (error != undefined) {
                    return res.send({
                        code: 401,
                        data: null,
                        received: false,
                    });
                }
            }
        });
    },
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { post_id } = req.params;
                yield this.createQueryBuilder("post")
                    .delete()
                    .from(post_entity_1.PostEntity)
                    .where("post.post_id = :post_id", { post_id })
                    .execute()
                    .then((data) => {
                    console.log(data);
                    let isAffected = data.effected;
                    if (isAffected > 0) {
                        return res.send({
                            code: 204,
                            data: "Post is deleted",
                            deleted: true,
                        });
                    }
                    else {
                        return res.send({
                            code: 401,
                            data: "Post is not deleted",
                            deleted: false,
                        });
                    }
                })
                    .catch((error) => {
                    if (error != undefined) {
                        console.log(error);
                        return res.send({
                            code: 401,
                            data: null,
                            deleted: false,
                        });
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    },
});
