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
      async (err: Error | null, hashedPassword: string) => {
        if (err !== null) {
          next(err);
          return;
        }

        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        await user.save();

        res.redirect("/");
      },
    );
  }),
];

export const userLoginGet = (_req: Request, res: Response): void => {
  res.render("loginform");
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

  passport.authenticate("local", { failureRedirect: "/login" }),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("registerform");
    }
    res.redirect("/");
  }),
];

export const userLogoutGet = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  req.logout((err) => {
    if (err !== null) {
      next(err);
    }
    res.redirect("/");
  });
};
