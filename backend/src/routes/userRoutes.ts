import express from "express";
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from "supertokens-node/framework/express";
import prisma from "../lib/prisma";

const userRoutes = express.Router();


export default userRoutes;