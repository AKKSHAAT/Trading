## **Why This Plan Works for You**
- You're not total beginners, so this plan **pushes your limits** with more tasks and shared responsibilities.
- You both touch **frontend and backend**, so you gain real full-stack experience.
- It introduces you to **real-world things**: auth, WebSockets, APIs, database modeling, deployment — all the stuff companies look for.

---

## **Detailed Breakdown**

### **Day 1 – Setup (Build the Skeleton)**
**Goal:** Get your development environment and folder structure ready.

- **Akshat:**
  - Sets up the frontend using Next.js (pages or App Router), Tailwind for UI, and React Query/Axios for API communication.
  - Basic routes like `/login`, `/register`, `/dashboard` — just wireframes at this stage.
  
- **Abhinav:**
  - Sets up the Express server with PostgreSQL using Prisma.
  - Writes the base DB schema for users, portfolios, transactions.
  - Adds JWT and bcrypt boilerplate — foundational for user login.

> By end of Day 1: You should be able to run both apps locally with placeholder pages and an empty backend ready to serve data.

---

### **Day 2 – Authentication**
**Goal:** Create secure login and registration with JWT-based authentication.

- **Akshat:**
  - Builds the login/register forms using state/form libs like Formik or useState.
  - Handles JWT token storage in localStorage or cookies (context-based auth).

- **Abhinav:**
  - Builds the `/register` and `/login` backend routes.
  - Hashes passwords with `bcrypt`, returns JWT tokens.

> By the end: Login/signup should fully work and give you access to protected pages after logging in.

---

### **Day 3 – Portfolio UI + Backend**
**Goal:** Show the user’s portfolio, balance, and recent transactions.

- **Akshat:**
  - Makes a clean dashboard UI showing holdings, wallet balance, and history cards/tables.

- **Abhinav:**
  - Backend returns actual portfolio data seeded with ₹1,00,000 for each user.
  - Adds mock holdings so the UI doesn’t look empty.

> By the end: You'll have a real working dashboard — not just dummy UI.

---

### **Day 4 – Real-Time Stock Prices**
**Goal:** Connect to Finnhub WebSocket for **live stock prices** and broadcast them to the frontend.

- **Akshat:**
  - Uses `socket.io-client` to listen to live price data.
  - Shows real-time updates (and maybe price color changes).

- **Abhinav:**
  - Backend connects to Finnhub’s WebSocket.
  - Sets up a WebSocket server that your frontend connects to instead of directly connecting to Finnhub.
  
> This avoids rate limits and keeps control centralized.

---

### **Day 5 – Buy/Sell Logic**
**Goal:** Let users make trades using their virtual money.

- **Akshat:**
  - UI for buying and selling stocks with validation.
  - Previews trade impact (e.g., updated balance after buying X shares).

- **Abhinav:**
  - Trade logic: checks if balance is enough, updates holdings, logs the transaction.
  - Routes: `/api/trade/buy` and `/api/trade/sell`.

> By the end: You’ll have a working trading system.

---

### **Day 6 – History & Leaderboard**
**Goal:** Let users view their past trades and compete with others.

- **Akshat:**
  - Builds a sortable table of transactions.
  - Creates a leaderboard UI showing top-performing portfolios.

- **Abhinav:**
  - Returns all trades sorted by date.
  - Computes user gains/losses and sorts for leaderboard.

> Now your app feels like a real trading game.

---

### **Day 7 – Final Touches + Deployment**
**Goal:** Finalize the app and make it live.

- Fix bugs, polish UI, and make sure everything works on mobile too.
- Deploy frontend on **Vercel**, backend on **Render or Fly.io**.
- Write a proper README — this helps if you want to put it in your resume or submit to hackathons.

---

## **Bonus**
Let me know if you want:
- Auto-deployment from GitHub
- Email/password + Google Auth setup
- Charts (Recharts/Candlestick)
- Notification system

---

Would you like me to create:
- A Prisma DB schema to save time?
- A socket.io setup boilerplate for backend + frontend?
- Deployment walkthrough?

You’re moving fast, so I’ll prep only what you need.