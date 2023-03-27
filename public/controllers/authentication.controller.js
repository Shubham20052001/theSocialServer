"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthenticationController = void 0;
const EmailValidator = __importStar(require("email-validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import { getCustomRepository } from "typeorm";
const user_repository_1 = require("../database/repository/user.repository");
dotenv_1.default.config();
class AuthenticationController {
    static showPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let jwt_secret_key = process.env.JWT_SECRET_KEY;
            let token = req.headers.authorization;
            jsonwebtoken_1.default.verify(token, jwt_secret_key, (error, data) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return res.send({
                        data: error,
                        received: false,
                    });
                }
                return res.send({
                    posts: "List of posts",
                    userdata: data,
                });
            }));
        });
    }
    static validateEmail(useremail) {
        let isEmailValidated = EmailValidator.validate(useremail);
        return isEmailValidated;
    }
    // * Sign-Up method
    static createNewAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { useremail, userpassword } = req.body;
            let jwt_secret_key = process.env.JWT_SECRET_KEY;
            if (!AuthenticationController.validateEmail(useremail)) {
                return res.send({
                    code: 402,
                    data: "Provide valid email",
                    authentication: false,
                });
            }
            // * Ecrypting password using bcrypt
            let salt = yield bcrypt_1.default.genSalt(10);
            bcrypt_1.default.hash(userpassword, salt, (error, hashedPassword) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return res.send({
                        code: 401,
                        message: error,
                        authentication: false,
                    });
                }
                //! Saving User Data
                // let userRepository = getCustomRepository(UserRepository);
                yield user_repository_1.UserRepository.saveUserData(req, res, hashedPassword);
                //! Sending JWT
                jsonwebtoken_1.default.sign({
                    useremail, //! Payload
                }, jwt_secret_key, //! Secret Key
                {
                    expiresIn: "1h", //! Expiry Time
                }, (error, data) => __awaiter(this, void 0, void 0, function* () {
                    //! Callback
                    if (error) {
                        return res.send({
                            code: 401,
                            message: "Something went wrong, Try again",
                            authentication: false,
                        });
                    }
                    return res.send({
                        code: 201,
                        message: data,
                        authentication: true,
                    });
                }));
            }));
        });
    }
    // * Login method
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let jwt_secret_key = process.env.JWT_SECRET_KEY;
            let { useremail, userpassword } = req.body;
            if (!AuthenticationController.validateEmail(useremail)) {
                return res.send({
                    data: "Provide valid email",
                    authentication: false,
                });
            }
            // ! Check User data
            let userdata = yield user_repository_1.UserRepository.findUserPassword(req, res, useremail);
            let basePassword = userdata.userpassword;
            // ! Compare passwords
            bcrypt_1.default.compare(userpassword, basePassword, (error, result) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return res.send({
                        code: 401,
                        message: "Something went wrong",
                        authentication: false,
                    });
                }
                if (!result) {
                    return res.send({
                        code: 407,
                        message: "Wrong Password",
                        authentication: false,
                    });
                }
                jsonwebtoken_1.default.sign({
                    useremail, //! Payload
                }, jwt_secret_key, //! Secret Key
                // {
                //   expiresIn: "1h", //! Expiry Time
                // },
                (error, data) => __awaiter(this, void 0, void 0, function* () {
                    //! Callback
                    if (error) {
                        return res.send({
                            code: 401,
                            message: error,
                            authentication: false,
                        });
                    }
                    return res.send({
                        code: 201,
                        message: data,
                        authentication: true,
                    });
                }));
            }));
        });
    }
    //! Decode JWT
    static decodeJwt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.headers.authorization;
            let jwt_secret_key = process.env.JWT_SECRET_KEY;
            jsonwebtoken_1.default.verify(token, jwt_secret_key, (error, data) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return res.send({
                        code: 403,
                        message: null,
                    });
                }
                else {
                    var userEmail = data.useremail;
                    return res.send({
                        code: 200,
                        message: userEmail,
                    });
                }
            }));
        });
    }
    static getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_repository_1.UserRepository.getUserByEmail(req, res);
        });
    }
}
exports.AuthenticationController = AuthenticationController;
