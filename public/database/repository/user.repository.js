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
exports.UserRepository = void 0;
const user_entity_1 = require("../entity/user.entity");
const ormconfig_1 = __importDefault(require("../../ormconfig"));
// @EntityRepository(UserEntity)
exports.UserRepository = ormconfig_1.default.getRepository(user_entity_1.UserEntity).extend({
    saveUserData(req, res, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            let { username, useremail, userimage } = req.body;
            let checkIfUserExists = (yield this.createQueryBuilder("users")
                .select()
                .where("users.useremail = :useremail", {
                useremail: useremail,
            })
                .getCount()) > 0;
            if (checkIfUserExists) {
                return res.send({
                    code: 403,
                    authenticated: false,
                    message: "User already exists",
                });
            }
            this.createQueryBuilder("users")
                .insert()
                .values({
                userimage,
                username,
                useremail,
                userpassword: hashedPassword,
            })
                .execute();
        });
    },
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { useremail } = req.body;
            let userDetails = yield this.createQueryBuilder("users")
                .select()
                .where("users.useremail = :useremail", {
                useremail: useremail,
            })
                .getOne();
            res.send(userDetails);
        });
    },
    findUserPassword(req, res, useremail) {
        return __awaiter(this, void 0, void 0, function* () {
            let getbaseuserpassword = this.createQueryBuilder("users")
                .select("users.userpassword")
                .where("users.useremail = useremail", { useremail })
                .getOne();
            if (getbaseuserpassword == undefined) {
                res.send({
                    code: 403,
                    message: "User not found",
                    authenticated: false,
                });
            }
            return getbaseuserpassword;
        });
    },
});
