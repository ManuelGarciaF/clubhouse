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
  body("passwordconfirm", "Password confirmation must match password.").custom(
    (value, { req }) => value === req.body.password,
  ),

  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("registerform");
      return;
    }

    bcrypt.hash(
      req.body.password,
      10,
      (err: Error | null, hashedPassword: string) => {
        if (err !== null) {
          next(err);
          return;
        }

        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });

        user
          .save()
          .then(() => {
            res.redirect("/login");
          })
          .catch((err) => {
            next(err);
          });
      },
    );
  }),
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

export const userJoinGet = (req: Request, res: Response): void => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
    return;
  }
  res.render("joinform", { messages: req.flash("error") });
};

export const userJoinPost = [
  body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      res.redirect("/login");
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("joinform");
      return;
    }

    console.log(req.body.password);
    if (req.body.password !== process.env.JOIN_PASSWORD) {
      console.log("correct");
      req.flash("error", "Incorrect password.");
      res.render("joinform", { messages: req.flash("error") });
      return;
    }
    req.user.isMember = true;
    await req.user.save();
    req.flash("info", "Congratulations! You are now a member of the club.");
    res.redirect("/");
  }),
];
