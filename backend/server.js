const express = require("express");

const cors = require("cors");

require("dotenv").config();

const initializeDatabase = require("./config/initDb");

const authRoutes = require("./routes/authRoutes");

const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/requests", requestRoutes);

app.get("/", (req, res) => {
  res.send("welcome to the approval workflow system API");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
