import { join } from "path";
import { DataSource } from "typeorm";
import { PostEntity } from "./database/entity/post.entity";
import { StoryEntity } from "./database/entity/story.entity";
import { UserEntity } from "./database/entity/user.entity";

const connectionOptions: DataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Shubham@321",
  database: "thesocial",
  entities: [UserEntity, PostEntity, StoryEntity],
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  logging: false,
  logger: "debug",
  migrations: [join(__dirname, "src/migration/**/*.ts")],
});

export = connectionOptions;
