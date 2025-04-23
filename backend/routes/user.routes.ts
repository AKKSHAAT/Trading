import express from "express";
import {body} from 'express-validator'
import { handleUserCreation } from "../controllers/user.controls.js";
const userRoute = express.Router();

userRoute.get('/register',[body('email').isEmail().withMessage("Invalid email"),
    body('username').isLength({min:3}).withMessage("Username must be 3 characters long"),
    body('password').isLength({min: 8}).withMessage("Password must be at leat 8 characters long")
], handleUserCreation)

export default userRoute;