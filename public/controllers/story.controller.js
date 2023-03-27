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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryController = void 0;
const story_repository_1 = require("../database/repository/story.repository");
class StoryController {
    static addStory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield story_repository_1.StoryRepository.addStory(req, res);
        });
    }
    static fetchPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield story_repository_1.StoryRepository.fetchStory(req, res);
        });
    }
    static fetchStoryByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield story_repository_1.StoryRepository.fetchStoryByUser(req, res);
        });
    }
    static fetchStoryOfOtherPeople(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield story_repository_1.StoryRepository.fetchStoryOfOtherPeople(req, res);
        });
    }
    static deleteStory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield story_repository_1.StoryRepository.deleteStory(req, res);
        });
    }
}
exports.StoryController = StoryController;
