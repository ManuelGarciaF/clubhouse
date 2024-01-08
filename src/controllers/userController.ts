import User from "../models/user";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import passport from "passport";
import type { NextFunction, Request, Response } from "express";

export const userCreateGet = (_req: Request, res: Response): void => {
    res.render("registerform");
};

export const userCreatePost = [
    body("username", "Username must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password", "Password must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body(
        "passwordconfirm",
        "Password confirmation must match password.",
    ).custom((value, { req }) => value === req.body.password),

    asyncHandler(
        async (
            req: Request,
            res: Response,
            next: NextFunction,
        ): Promise<void> => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors.array().forEach((error) => {
                    req.flash("error", error.msg);
                });
                res.render("registerform");
                return;
            }

            // Indentation hell
            bcrypt.hash(
                req.body.password,
                10,
                (err: Error | null, hashed: string): void => {
                    if (err !== null) {
                        next(err);
                        return;
                    }

                    const user = new User({
                        username: req.body.username,
                        password: hashed,
                    });

                    user.save()
                        .then(() => {
                            res.redirect("/login");
                        })
                        .catch((err) => {
                            next(err);
                        });
                },
            );
        },
    ),
];

export const userLoginGet = (req: Request, res: Response): void => {
    const messages = req.flash("error");

    if (req.isAuthenticated()) {
        res.redirect("/");
        return;
    }

    res.render("loginform", { messages });
};

export const userLoginPost = [
    body("username", "Username must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password", "Password must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: "Invalid username or password.",
    }),
];

export const userLogoutPost = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    req.logout((err) => {
        if (err !== undefined) {
            next(err);
            return;
        }
        res.redirect("/");
    });
};

export const userBecomeMemberGet = (req: Request, res: Response): void => {
    if (!req.isAuthenticated()) {
        res.redirect("/login");
        return;
    }
    res.render("joinform", { messages: req.flash("error") });
};

export const userBecomeMemberPost = [
    body("password", "Password must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        if (!req.isAuthenticated()) {
            res.redirect("/login");
            return;
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash("error", "Password must not be empty.");
            res.redirect("/becomemember");
            return;
        }

        console.log(req.body.password);
        if (req.body.password !== process.env.JOIN_PASSWORD) {
            req.flash("error", "Incorrect password.");
            res.redirect("/becomemember");
            return;
        }
        req.user.isMember = true;
        await req.user.save();
        req.flash("info", "Congratulations! You are now a member of the club.");
        res.redirect("/");
    }),
];
