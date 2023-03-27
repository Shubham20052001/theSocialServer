import { join } from "path";
import { DataSource } from "typeorm";
import { PostEntity } from "./database/entity/post.entity";
import { StoryEntity } from "./database/entity/story.entity";
import { UserEntity } from "./database/entity/user.entity";

const connectionOptions: DataSource = new DataSource({
  type: "postgres",
  host: "containers-us-west-167.railway.app",
  port: 5860,
  username: "postgres",
  password: "2YEmVsOmaEQ5EGNBfFfe",
  database: "railway",
  entities: [UserEntity, PostEntity, StoryEntity],
  synchronize: true,
  dropSchema: false,
  migrationsRun: true,
  logging: false,
  logger: "debug",
  migrations: [join(__dirname, "src/migration/**/*.ts")],
});

export = connectionOptions;
