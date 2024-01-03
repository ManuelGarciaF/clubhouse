import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import type { Request, Response, NextFunction } from "express";
import type { HttpError } from "http-errors";

import User from "./models/user";
import indexRouter from "./routes/index";

const app = express();

dotenv.config();

// Connect to mongodb
if (
    process.env.MONGODB_USER === undefined ||
    process.env.MONGODB_PASS === undefined
) {
    console.error("MONGODB_USER or MONGODB_PASS is undefined");
    process.exit(1);
}
const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.e902pw3.mongodb.net/clubhouse?retryWrites=true&w=majority`;
const connectToDB = async (): Promise<void> => {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to mongodb");
};
connectToDB().catch(console.error);

// View engine setup
app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "ejs");

// Authentication
passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username })
            .exec()
            .then((user) => {
                // If user not found
                if (user === null) {
                    done(null, false, {
                        message: "Incorrect username or password.",
                    });
                    return;
                }

                bcrypt
                    .compare(password, user.password)
                    .then((passwordsMatch) => {
                        if (!passwordsMatch) {
                            done(null, false, {
                                message: "Incorrect username or password.",
                            });
                            return;
                        }

                        done(null, user);
                    })
                    .catch((err) => {
                        done(err);
                    });
            })
            .catch((err) => {
                done(err);
            });
    }),
);

passport.serializeUser((user: any, done) => {
    process.nextTick(() => {
        done(null, user._id);
    });
});

passport.deserializeUser((id: number, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err);
        });
});

// Sessions
if (process.env.SESSION_SECRET === undefined) {
    console.error("SESSION_SECRET is undefined");
    process.exit(1);
}
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: MONGO_URI }),
    }),
);
app.use(passport.authenticate("session"));

// Add locals for authentication, membership status and admin status
app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user;
    next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(flash());
app.use(express.static(path.resolve(__dirname, "../public")));

app.use("/", indexRouter);

// Catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction): void => {
    next(createError(404));
});

// Error handler
app.use(
    (
        err: HttpError,
        req: Request,
        res: Response,
        _next: NextFunction,
    ): void => {
        // Set locals, only providing errors in development
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        // Render the error page
        res.status(err.status === undefined ? err.status : 500);
        res.render("error");
    },
);

app.listen(3000);
console.log("Server listening on port 3000");
