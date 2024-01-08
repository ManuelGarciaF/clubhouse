import Post from "../models/post";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";

export const postListGet = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const posts = await Post.find().populate("author").sort("-date").exec();

        // Only show author of posts if user is a member.
        const showAuthor: boolean =
            req.isAuthenticated() && (req.user.isMember || req.user.isAdmin);

        res.render("index", {
            posts,
            showAuthor,
            errorMessages: req.flash("error"),
            infoMessages: req.flash("info"),
        });
    },
);

export const postCreatePost = [
    body("postcontent", "Post content must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        // Require authentication
        if (!req.isAuthenticated()) {
            res.redirect("/login");
            return;
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", "Post content must not be empty.");
            res.redirect("/");
            return;
        }

        const post = new Post({
            content: req.body.postcontent,
            author: req.user._id,
        });

        await post.save();

        res.redirect("/");
    }),
];

export const postDeletePost = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        // Require authentication
        if (!req.isAuthenticated()) {
            res.redirect("/login");
            return;
        }
        // Verify user is an admin
        if (!req.user.isAdmin) {
            res.status(403);
            res.send("Forbidden: You must be an admin to delete posts");
            return;
        }

        await Post.findByIdAndDelete(req.body.id).exec();
        res.redirect(303, "/");
    },
);
