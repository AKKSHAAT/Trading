import 'dotenv/config'
import express from "express";
import cors from 'cors'
import supertokens, { User } from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { middleware } from "supertokens-node/framework/express";
import { errorHandler } from "supertokens-node/framework/express";
import prisma from './lib/prisma';
import userRoute from './routes/userRoutes';


const app = express();
const PORT = process.env.PORT;

supertokens.init({
  framework: "express",
  supertokens: {
      connectionURI: "https://try.supertokens.io",
      // apiKey: <YOUR_API_KEY>
  },
  appInfo: {
    appName: "trading-backend",
    apiDomain: "http://localhost:8000",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/api/auth",       
    websiteBasePath: "/auth",
  },
  recipeList: [
    EmailPassword.init({
      override: {
        apis: (originalImplementation) => {
          return {
            ...originalImplementation,
            signUpPOST: async function (input) {
              if (originalImplementation.signUpPOST === undefined) {
                throw Error("Should never come here");
              }
              const response = await originalImplementation.signUpPOST(input);
    
              if (response.status === "OK") {
                const { user } = response;
                const {id: userId } = user;
                const email = user.emails?.[0]
    
                await prisma.user.create({
                  data: {
                    id: userId,
                    email,
                  },
                });

                await dummyFactory(userId)
                // await prisma.portfolio.create({
                //   data:{
                //     userId
                //   }
                // })
              }
    
              return response;
            }
          };
        }
      }
    }),
    Session.init()
    ]
});


app.use(
	cors({
		origin: "http://localhost:3000",
		allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
		credentials: true,
	}),
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/auth", userRoutes); 
app.use('/api/user', userRoute);

app.use(middleware());
app.use(errorHandler());



app.get("/", (req, res) => {
  res.json({ message: "Express + TypeScript server is running" });
});


//factory function 
async function dummyFactory(id: string){
  const portfolio = await prisma.portfolio.create({
    data:{
      userId: id
    }
  })

  const stock = await prisma.stock.create({
    data:{
      symbol: "AAPL",
      name: "Apple"
    }
  })

  const portfolioEntry = await prisma.portfolioEntry.create({
    data:{
      portfolioId: portfolio.id,
      stockId: stock.id,
      quantity: 1,
      avgBuyPrice: 150.00
    }
  })

}


//neeonDb connection
async function connectDb(){
  try {
    await prisma.$connect();
    console.log("Connected to neonDB successfully")
  } catch (error) {
    console.log("Connection issue\n", error);
  }
}

connectDb()
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
