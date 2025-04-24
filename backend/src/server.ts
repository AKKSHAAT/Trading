import 'dotenv/config'
import express from "express";
import cors from 'cors'
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { middleware } from "supertokens-node/framework/express";

import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT;

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


app.use(
	cors({
		origin: "http://localhost:8000",
		allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
		credentials: true,
	}),
);

app.use(middleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRoutes); 

app.get("/", (req, res) => {
  res.json({ message: "Express + TypeScript server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
