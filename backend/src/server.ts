import express from "express";

const app = express();
const PORT = 3001;

// Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req:any, res:any) => {
  res.json({ message: "Express + TypeScript Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
