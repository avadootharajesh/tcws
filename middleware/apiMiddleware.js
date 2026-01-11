// api Middleware
const apiKeyUtil = require("../utils/secretutils.js");
const apiKeyClass = new apiKeyUtil.APIKeyUtils();

// Middleware to check for valid API key in request headers
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(400).json({
      message: "API key is missing from headers",
      status: "error",
    });
  }
  const apiKeyResponse = apiKeyClass.validateApiKey(apiKey);
  if (apiKeyResponse.status === "success") next();
  else res.status(401).json(apiKeyResponse);
};

module.exports = { validateApiKey };
