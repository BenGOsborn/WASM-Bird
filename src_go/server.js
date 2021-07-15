const express = require('express')
const session = require('express-session')

// Initialize the app and middleware
const app = express()
app.use(express.static(__dirname + "/static"));
app.use(express.json())
app.use(session({
    secret: process.env.SECRET || "secret",
    resave: false,
    saveUninitialized: false
}))

// Set the sessions high score
app.post("/high_score", async (req, res) => {
    // Get the high score from the request
    const { high_score } = req.body;

    // Set the high score
    if (high_score) {
        req.session.high_score = high_score;

        res.sendStatus(200);
    } else {
        res.status(400).send("'high_score' param missing!");
    }
});

// Get the sessions high score
app.get("/high_score", async (req, res) => {
    if (typeof req.session.high_score !== "undefined") {
        res.status(200).json({ high_score: req.session.high_score });
    } else {
        res.status(400).end("No high score for this session!");
    }
});

// Set the port and listen on it
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});