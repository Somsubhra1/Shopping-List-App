const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

// Init App
const app = express();

const db = process.env.mongoURI;

// Connect to mongo db
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log(`MongoDB connected successfully`))
    .catch(err => console.log(`Error connecting mongodb ` + err));

// Express body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for CORS request
app.use(cors());

// Use routes

app.use("/api/items", require("./routes/api/items"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
