import express from "express";

const app = express();

// Serve static content
app.use("/", express.static(__dirname + "/static"));

// Return different WASM depending on the URL
app.get("/:bin", async (req, res) => {
    // Get the name of the binary file to serve
    const bin = req.params.bin;

    // Now what I am going to do is split up the different apps into their own different folders
    // This way I can serve each app indepdently statically without any other configuration
    // Each app gets its own folder in the static path (or is fetched and loaded into that path for GCloud integration)
});

// Set the port and listen on it
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
