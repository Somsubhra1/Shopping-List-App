const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

// Init App
const app = express();

const db = process.env.mongoURI;

// Connect to mongo db
mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log(`MongoDB connected successfully`))
    .catch(err => console.log(`Error connecting mongodb ` + err));

// Express body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for CORS request
app.use(cors());

// Use routes
app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

// Serve static assets if app is in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
