import express from "express";
import * as userController from "../controllers/userController";
import * as postController from "../controllers/postController";

const router = express.Router();

// Post list index page
router.get("/", postController.postListGet);

// Register
router.get("/register", userController.userCreateGet);
router.post("/register", userController.userCreatePost);

// Login
router.get("/login", userController.userLoginGet);
router.post("/login", userController.userLoginPost);

// Logout
router.post("/logout", userController.userLogoutPost);

// New Member
router.get("/join", userController.userJoinGet);
router.post("/join", userController.userJoinPost);

// New Post
router.post("/new-post", postController.postCreatePost);

export default router;
