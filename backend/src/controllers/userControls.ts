// controllers/user.controller.ts
import { Request, Response } from "express";
import { createUser } from "../prisma/models/user.modle"; 
import prisma from "../lib/prisma";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { SessionRequest } from "supertokens-node/framework/express";

export const handleUserRegistration = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Use SuperTokens to sign up
    const signUpResponse = await EmailPassword.signUp("public", email, password);

    if (signUpResponse.status === "OK") {
      // Create the user in our database with additional info
      const newUser = await createUser(username, email, signUpResponse.user.id);

      // Create session with required parameters
      // const sessionData = await Session.createNewSession(req as SessionRequest, res, signUpResponse.user.id, {}, {sessionExpiry: 24*60*60, enableAntiCsrf: true}, true);
      const sessionData = await Session.createNewSession(res, signUpResponse.user.id);


      return res.status(201).json({
        status: "success",
        user: newUser,
        session: sessionData
      });

    } else {
      return res.status(409).json({
        status: "error",
        message: "User already exists"
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

export const handleUserSignin = async(req: Request, res: Response) => {
  const { email, password } = req.body;
    
  try {
    // Use SuperTokens to sign in
    const signInResponse = await EmailPassword.signIn("public", email, password);

    if (signInResponse.status === "OK") {
      // Create session with required parameters
      const sessionData = await Session.createNewSession(req as SessionRequest, res, signInResponse.user.id, {}, {}, true);

      // Get user from database to return additional info
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          username: true,
          email: true,
          portfolio: true,
          createdAt: true
        }
      });

      return res.json({
        status: "success",
        user,
        session: sessionData
      });
    } else {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials"
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}