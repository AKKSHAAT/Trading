import express, { Request, Response } from "express";
import supertokens from 'supertokens-node';
import cors from 'cors'
import { middleware } from 'supertokens-node/framework/express';
import Session from 'supertokens-node/recipe/session';
import { errorHandler } from 'supertokens-node/framework/express';
import EmailPassword from "supertokens-node/recipe/emailpassword";

const app = express();
const PORT = process.env.PORT || 3001;

//supertokens
supertokens.init({
  framework: "express",
  supertokens: {
      // We use try.supertokens for demo purposes.
      // At the end of the tutorial we will show you how to create
      // your own SuperTokens core instance and then update your config.
      connectionURI: "https://try.supertokens.io",
      // apiKey: <YOUR_API_KEY>
  },
  appInfo: {
      // learn more about this on https://supertokens.com/docs/session/appinfo
      appName: "trading-backend",
      apiDomain: "http://localhost:8000",
      websiteDomain: "http://localhost:8000",
      apiBasePath: "/api/auth",
      websiteBasePath: "/api/auth",
  },
  recipeList: [
      EmailPassword.init(), // initializes signin / sign up features
      Session.init() // initializes session features
  ]
});


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://localhost:8000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
		credentials: true,
  })
)
app.use(middleware())



// Test route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Express + TypeScript Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
