import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PostEntity } from "./post.entity";
import { StoryEntity } from "./story.entity";

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({
    nullable: false,
  })
  username!: string;

  @Column({
    nullable: false,
  })
  useremail!: string;

  @Column({
    nullable: false,
  })
  userpassword!: string;

  @Column({
    nullable: true,
  })
  userimage!: string;

  @OneToMany(() => PostEntity, (user_post) => user_post.post_user)
  @JoinColumn()
  user_post!: PostEntity[];

  @OneToMany(() => StoryEntity, (user_story) => user_story.story_user)
  @JoinColumn()
  user_story!: StoryEntity[];
}
