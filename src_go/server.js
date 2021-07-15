const express = require('express')

// Initialize the app and middleware
const app = express()
app.use(express.static(__dirname + "/static"));

// Set the port and listen on it
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});