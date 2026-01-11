// tfi handler routes
const express = require("express");
const tfiPathRouter = express.Router();

// Handle GET requests to /tfi
tfiPathRouter.get("/", (req, res) => {
  console.log("TFI GET request accessed");
  res.json({
    message: "TFI endpoint reached successfully.",
    timestamp: new Date(),
    path: req.originalUrl,
    method: req.method,
    description: "Query specific TFI data here.",
  });
});

// Export the router
module.exports = { tfiPathRouter: tfiPathRouter };