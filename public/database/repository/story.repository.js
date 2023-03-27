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
exports.StoryRepository = void 0;
const ormconfig_1 = __importDefault(require("../../ormconfig"));
const story_entity_1 = require("../entity/story.entity");
const user_repository_1 = require("./user.repository");
exports.StoryRepository = ormconfig_1.default.getRepository(story_entity_1.StoryEntity).extend({
    addStory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { useremail } = req.params;
            let { story_assets } = req.body;
            let user = yield user_repository_1.UserRepository.findOneBy({ useremail });
            let storyEntity = new story_entity_1.StoryEntity();
            storyEntity.story_user = user;
            storyEntity.story_assets = story_assets;
            const StoryRepository = ormconfig_1.default.getRepository(story_entity_1.StoryEntity);
            yield StoryRepository.save(storyEntity)
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
    fetchStory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let stories = yield this.createQueryBuilder("story")
                    .leftJoinAndSelect("story.story_user", "users")
                    .select()
                    .getMany();
                if (stories != undefined) {
                    return res.send({
                        code: 200,
                        data: stories,
                    });
                }
            }
            catch (error) {
                if (error) {
                    console.log(error);
                    return res.send({
                        code: 401,
                        data: "Something went wrong.",
                    });
                }
            }
        });
    },
    fetchStoryByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { useremail } = req.params;
            try {
                let story = yield this.createQueryBuilder("story")
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
            }
            catch (error) {
                if (error) {
                    console.log(error);
                    return res.send({
                        code: 401,
                        data: "Something went wrong.",
                    });
                }
            }
        });
    },
    fetchStoryOfOtherPeople(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { useremail } = req.params;
            try {
                let story = yield this.createQueryBuilder("story")
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
            }
            catch (error) {
                if (error) {
                    console.log(error);
                    return res.send({
                        code: 401,
                        data: "Something went wrong.",
                    });
                }
            }
        });
    },
    deleteStory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { story_id } = req.params;
                yield this.createQueryBuilder("story")
                    .delete()
                    .from(story_entity_1.StoryEntity)
                    .where("story.story_id = :story_id", { story_id })
                    .execute()
                    .then((data) => {
                    console.log(data);
                    let isAffected = data.affected;
                    if (isAffected > 0) {
                        return res.send({
                            code: 204,
                            data: "Story is deleted",
                            deleted: true,
                        });
                    }
                    else {
                        return res.send({
                            code: 401,
                            data: "Story is not deleted",
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
