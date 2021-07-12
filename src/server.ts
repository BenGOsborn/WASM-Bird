import express from "express";
import session from "express-session";

// Initialize the app and add middleware
const app = express();
app.use(express.static(__dirname + "/static"));
app.use(
    session({
        secret: process.env.SECRET || "secret",
        resave: false,
        saveUninitialized: false,
    })
);

app.get("*", async (req, res) => {
    // @ts-ignore
    req.session.viewCount += 1;

    // .... Authentication / session logic

    // Return the file with the scripts
    res.sendFile(__dirname + "/index.html");
});

// Set the port and listen on it
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
