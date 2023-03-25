import { Request, Response } from "express";
import * as EmailValidator from "email-validator";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
// import { getCustomRepository } from "typeorm";
import { UserRepository } from "../database/repository/user.repository";

dotenv.config();
export class AuthenticationController {
  static async showPosts(req: Request, res: Response) {
    let jwt_secret_key = process.env.JWT_SECRET_KEY as string;
    let token = req.headers.authorization as string;
    Jwt.verify(token, jwt_secret_key, async (error: any, data: any) => {
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
    });
  }

  static validateEmail(useremail: string): boolean {
    let isEmailValidated = EmailValidator.validate(useremail);
    return isEmailValidated;
  }

  // * Sign-Up method
  static async createNewAccount(req: Request, res: Response) {
    let { useremail, userpassword } = req.body;
    let jwt_secret_key = process.env.JWT_SECRET_KEY as string;

    if (!AuthenticationController.validateEmail(useremail)) {
      return res.send({
        code: 402, //! Invalid Email
        data: "Provide valid email",
        authentication: false,
      });
    }

    // * Ecrypting password using bcrypt
    let salt = await bcrypt.genSalt(10);
    bcrypt.hash(userpassword, salt, async (error: any, hashedPassword: any) => {
      if (error) {
        return res.send({
          code: 401, //! General error
          message: error,
          authentication: false,
        });
      }

      //! Saving User Data
      // let userRepository = getCustomRepository(UserRepository);
      await UserRepository.saveUserData(req, res, hashedPassword);

      //! Sending JWT
      Jwt.sign(
        {
          useremail, //! Payload
        },
        jwt_secret_key, //! Secret Key
        {
          expiresIn: "1h", //! Expiry Time
        },
        async (error: any, data: any) => {
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
        }
      );
    });
  }

  // * Login method
  static async login(req: Request, res: Response) {
    let jwt_secret_key = process.env.JWT_SECRET_KEY as string;
    let { useremail, userpassword } = req.body;

    if (!AuthenticationController.validateEmail(useremail)) {
      return res.send({
        data: "Provide valid email",
        authentication: false,
      });
    }

    // ! Check User data
    let userdata = await UserRepository.findUserPassword(req, res, useremail);
    let basePassword = userdata!.userpassword;

    // ! Compare passwords
    bcrypt.compare(
      userpassword,
      basePassword,
      async (error: any, result: any) => {
        if (error) {
          return res.send({
            code: 401,
            message: "Something went wrong",
            authentication: false,
          });
        }

        if (!result) {
          return res.send({
            code: 407, //! Wrong password
            message: "Wrong Password",
            authentication: false,
          });
        }

        Jwt.sign(
          {
            useremail, //! Payload
          },
          jwt_secret_key, //! Secret Key
          // {
          //   expiresIn: "1h", //! Expiry Time
          // },
          async (error: any, data: any) => {
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
          }
        );
      }
    );
  }

  //! Decode JWT
  static async decodeJwt(req: Request, res: Response) {
    let token = req.headers.authorization as string;
    let jwt_secret_key = process.env.JWT_SECRET_KEY as string;

    Jwt.verify(token, jwt_secret_key, async (error: any, data: any) => {
      if (error) {
        return res.send({
          code: 403,
          message: null,
        });
      } else {
        var userEmail = data.useremail!;
        return res.send({
          code: 200,
          message: userEmail,
        });
      }
    });
  }

  static async getUserDetails(req: Request, res: Response) {
    await UserRepository.getUserByEmail(req, res);
  }
}
