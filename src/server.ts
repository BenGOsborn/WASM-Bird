import express from "express";

const app = express();

// Serve static content
app.use("/", express.static(__dirname + "/static"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
