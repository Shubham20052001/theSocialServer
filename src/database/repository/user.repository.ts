import { EntityRepository, Repository } from "typeorm";
import { UserEntity } from "../entity/user.entity";
import { Request, Response } from "express";
import datasource from "../../ormconfig";

// @EntityRepository(UserEntity)
export const UserRepository = datasource.getRepository(UserEntity).extend({
  async saveUserData(req: Request, res: Response, hashedPassword: any) {
    let { username, useremail, userimage } = req.body;
    let checkIfUserExists =
      (await this.createQueryBuilder("users")
        .select()
        .where("users.useremail = :useremail", {
          useremail: useremail,
        })
        .getCount()) > 0;

    if (checkIfUserExists) {
      return res.send({
        code: 403, //! Invalid request
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
  },

  async getUserByEmail(req: Request, res: Response) {
    let { useremail } = req.body;
    let userDetails = await this.createQueryBuilder("users")
      .select()
      .where("users.useremail = :useremail", {
        useremail: useremail,
      })
      .getOne();
    res.send(userDetails);
  },

  async findUserPassword(
    req: Request,
    res: Response,
    useremail: string
  ): Promise<any> {
    let getbaseuserpassword = this.createQueryBuilder("users")
      .select("users.userpassword")
      .where("users.useremail = useremail", { useremail })
      .getOne();

    if (getbaseuserpassword == undefined) {
      res.send({
        code: 403, //! Invalid request
        message: "User not found",
        authenticated: false,
      });
    }

    return getbaseuserpassword;
  },
});
