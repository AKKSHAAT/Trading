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
// import stockRoutes from './routes/stockRoutes';
// import { testFinnhubConnection } from './utils/finnhubUtils';
import http from 'http';
import { Server } from 'socket.io';

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
    credentials: true,
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});
app.use(middleware());
app.use(errorHandler());

// app.use("/api/auth", userRoutes); 
app.use('/api/user', userRoute);
// app.use('/api/stocks', stockRoutes);



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


io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  socket.emit('message', 'Welcome to the trading app!');

  socket.on('place_order', (data) => {
    console.log('📥 Order received:', data);
        // process order or broadcast something
    io.emit('order_update', { message: 'Order processed', data });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});




server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.listen(PORT, async () => {
//   console.log(`Server is running on port ${PORT}`);
  
  // // Test Finnhub connection
  // const finnhubConnected = await testFinnhubConnection();
  // if (finnhubConnected) {
  //   console.log('Finnhub API is ready to use');
  // } else {
  //   console.warn('Warning: Finnhub API connection failed. Check your API key and network connection.');
  // }
// });
