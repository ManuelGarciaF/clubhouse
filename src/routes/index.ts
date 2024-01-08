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
router.get("/becomemember", userController.userBecomeMemberGet);
router.post("/becomemember", userController.userBecomeMemberPost);

// New Post
router.post("/newpost", postController.postCreatePost);

// Delete Post
router.post("/deletepost", postController.postDeletePost);

export default router;
