import express, { Router } from "express";
import { handleUserRegistration } from "../controllers/userControls"; 

const userRoutes: Router = express.Router();

userRoutes.post("/register", async (req, res, next) => {
    try {
        await handleUserRegistration(req, res);
    } catch (error) {
        next(error);
    }
});

export default userRoutes;
