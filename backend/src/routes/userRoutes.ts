import express, { Request, Response } from "express";
import { handlePortfolio } from "../controllers/userControls";

const router = express.Router();
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import { SessionRequest } from 'supertokens-node/framework/express';
import supertokens from "supertokens-node";


router.get('/:userId/portfolio', handlePortfolio);

router.get("/info", verifySession(), async (req: SessionRequest, res) => {
    let userId = req.session!.getUserId();
    let userInfo = await supertokens.getUser(userId)
    res.status(201).json({ userId, userInfo });
});

export default router;