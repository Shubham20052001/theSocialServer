import { Router } from "express";
import { AuthenticationController } from "../controllers/authentication.controller";

const authrouter = Router();

// authrouter.get("/posts", AuthenticationController.showPosts);

authrouter.get("/decode-jwt", AuthenticationController.decodeJwt);

authrouter.post("/signup", AuthenticationController.createNewAccount);
authrouter.post("/login", AuthenticationController.login);
authrouter.post("/details", AuthenticationController.getUserDetails);

export { authrouter };
