// imports
const servermetadata = require("./utils/servermetadata.json");

// routes
const { basePathRouter } = require("./routes/basePath");
const { tfiPathRouter } = require("./routes/tfiPath");
const { testPathRouter } = require("./routes/testPath");

// index.js
const express = require("express");
const app = express();
const port = servermetadata.PORT || 3001;

// Middleware to parse JSON
app.use(express.json());

// routes
app.use(servermetadata.BASE_API_PATH, basePathRouter);
app.use(`${servermetadata.TFI_PATH}`, tfiPathRouter);

// test
app.use(servermetadata.TEST_API_PATH, testPathRouter);

// invalid path handler
app.use((req, res, next) => {
  console.log("Invalid path accessed:", req.originalUrl);
  res.status(404).json({
    message: "Invalid path",
    timestamp: new Date(),
    path: req.originalUrl,
    method: req.method,
  });
});

// error handler
app.use((err, req, res, next) => {
  console.error("An error occurred:", err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
