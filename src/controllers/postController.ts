import Post from "../models/post";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";

export const postListGet = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const posts = await Post.find().populate("author").sort("-date").exec();

        const showAuthor: boolean = req.isAuthenticated() && req.user.isMember;

        res.render("index", { posts, showAuthor });
    },
);

export const postCreatePost = [
    body("postcontent", "Post content must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req, res) => {
        // Require authentication
        if (!req.isAuthenticated()) {
            res.redirect("/login");
            return;
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("index", { errors: errors.array() });
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
