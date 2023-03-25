import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("story")
export class StoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  story_id!: number;

  @Column({
    type: "simple-array",
    nullable: false,
  })
  story_assets!: string[];

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  story_time!: Date;

  @ManyToOne(() => UserEntity, (story_user) => story_user.user_story)
  story_user!: UserEntity;
}
