// basePath route handler
const express = require("express");
const basePathRouter = express.Router();

// utils
const apiKeyUtil = require("../utils/secretutils.js");

// Handle GET requests to the base API path
basePathRouter.get("/", (req, res) => {
  console.log("Base API path GET request accessed");
  res.json({
    message: "Welcome to the API!",
    timestamp: new Date(),
    path: req.originalUrl,
    method: req.method,
    description: "This is the base API endpoint providing general information.",
  });
});

// Handle POST requests to the base API path
basePathRouter.post("/", (req, res) => {
  console.log("Base API path POST request accessed");
  const requestBody = req.body;
  const username = requestBody.username || "Guest";
  const apiKeyClass = new apiKeyUtil.APIKeyUtils();
  const apiKeyResponse = apiKeyClass.generateApiKey(username);
  if(apiKeyResponse.status === "success") {
    res.json({
      message: `API Key generated successfully for user ${username}.`,
      apiKey: apiKeyResponse.apiKey,
    });
  } else {
    res.status(500).json({
      error: "API Key generation failed.",
      message: apiKeyResponse.message,
    });
  }
});

// Handle non-GET requests to the base API path
basePathRouter.all("/", (req, res) => {
  console.log("Base API path non-GET request accessed");
  res.status(405).json({
    error: "Method Not Allowed",
    message: `The ${req.method} method is not allowed on this endpoint.`,
  });
});

// Export the router
module.exports = { basePathRouter: basePathRouter };
