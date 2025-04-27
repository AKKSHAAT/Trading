import express, { Request, Response } from "express";
import { handlePortfolio } from "../controllers/userControls";

const router = express.Router();

router.get('/:userId/portfolio', handlePortfolio);

export default router;