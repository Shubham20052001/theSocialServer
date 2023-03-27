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
const express_1 = __importDefault(require("express"));
const authentication_routes_1 = require("./routes/authentication.routes");
const ormconfig_1 = __importDefault(require("./ormconfig"));
require("reflect-metadata");
const post_routes_1 = require("./routes/post.routes");
const story_routes_1 = require("./routes/story.routes");
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
console.log("before db connection");
ormconfig_1.default.initialize().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    if (connection.isInitialized) {
        console.log("Postgres Connected!");
    }
    app.set("port", port);
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.get("/", (req, res) => res.send("The Social Server"));
    //* Authentication route
    app.use("/user", authentication_routes_1.authrouter);
    //* Posts route
    app.use("/post", post_routes_1.postRouter);
    //* Story route
    app.use("/story", story_routes_1.storyRouter);
    app.listen(app.get("port"), () => {
        console.log(`The server is running at port ${app.get("port")}`);
    });
}));
