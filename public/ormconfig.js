"use strict";
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const post_entity_1 = require("./database/entity/post.entity");
const story_entity_1 = require("./database/entity/story.entity");
const user_entity_1 = require("./database/entity/user.entity");
const connectionOptions = new typeorm_1.DataSource({
    type: "postgres",
    host: "containers-us-west-167.railway.app",
    port: 5860,
    username: "postgres",
    password: "2YEmVsOmaEQ5EGNBfFfe",
    database: "railway",
    entities: [user_entity_1.UserEntity, post_entity_1.PostEntity, story_entity_1.StoryEntity],
    synchronize: true,
    dropSchema: false,
    migrationsRun: true,
    logging: false,
    logger: "debug",
    migrations: [(0, path_1.join)(__dirname, "src/migration/**/*.ts")],
});
module.exports = connectionOptions;
