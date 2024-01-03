import type { IUser } from "./models/user";
import type { HydratedDocument } from "mongoose";

declare module "express-serve-static-core" {
    export interface Request {
        user: HydratedDocument<IUser>;
    }
}
