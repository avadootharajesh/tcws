// testPath.js

// imports
const express = require("express");
const router = express.Router();

// Handle GET requests to /test
router.get("/", (req, res) => {
  const neonops = require("../db/neon/neonOps");
  // reset serial
  const requestBody = req.body;
  const tablename = requestBody.tablename;
  res.json({
    message: "Test endpoint reached successfully.",
    timestamp: new Date(),
    path: req.originalUrl,
    method: req.method,
    description: "Query specific test data here.",
  });
});

// Handle POST requests to /test
router.post("/", (req, res) => {
  const rquestBody = req.body;
  const neonops = require("../db/neon/neonOps");
  console.log("Test POST request accessed");
  neonops
    .GetEntriesByFields(
      rquestBody.tablename,
      rquestBody.columnsQuery,
      rquestBody.queryLogicalConnector
    )
    .then((response) => res.json(response))
    .catch((error) => res.json(error));
});

// Export the router
module.exports = { testPathRouter: router };
