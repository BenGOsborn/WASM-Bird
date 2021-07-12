import express from "express";

const app = express();

// Serve static content
app.use("/", express.static(__dirname + "/static"));

// Return different WASM depending on the URL
app.get("/:wasm_name", async (req, res) => {
    // Get the name of the path
    const wasmName = req.params.wasm_name;

    // Now I need to serve the correct WASM file off of the same javascript if possible ?
    // Could I do this using some sort of dynamic bundler ?
});

// Set the port and listen on it
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
