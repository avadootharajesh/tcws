// secretutils.js
// imports
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const servermetadata = require("../utils/servermetadata.json");
const { raw } = require("express");

// paths
const static_db_path = path.join(__dirname, "apiKeys.json");

// apiKey utils
class APIKeyUtils {
  constructor(dbPath = static_db_path) {
    this.dbPath = dbPath;
    this.users = servermetadata.MAINTAINER.map((user) => user.username);
    this.keyValidityDays = servermetadata.API_DETAILS.VALIDITY_DAYS || 30;
    this.SALT_ROUNDS = servermetadata.API_DETAILS.SALT_ROUNDS || 10;
    this.API_KEY_PREFIX = servermetadata.API_DETAILS.API_KEY_PREFIX || "ApiKey";
    this.PEPPER =
      servermetadata.API_DETAILS.API_ORIG_KEY || "default_pepper_string";
  }

  _readDBFile() {
    try {
      const data = fs.readFileSync(this.dbPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading DB file:", error);
      return {
        keys: [],
        metadata: [],
        message: "Error reading DB file",
        status: "error",
      };
    }
  }
  _writeDBFile(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), "utf-8");
      return {
        message: "DB file updated successfully",
        status: "success",
      };
    } catch (error) {
      console.error("Error writing DB file:", error);
      return {
        message: "Error writing DB file",
        status: "error",
      };
    }
  }
  _is_expired(createdAt) {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > this.keyValidityDays;
  }
  _generateRawKey() {
    return this.API_KEY_PREFIX + crypto.randomBytes(32).toString("hex");
  }
  _hashKey(rawKey) {
    const keyWithPepper = rawKey + this.PEPPER;
    const salt = bcrypt.genSaltSync(this.SALT_ROUNDS);
    return bcrypt.hashSync(keyWithPepper, salt);
  }
  _validateHash(rawKey, hashedKey) {
    const keyWithPepper = rawKey + this.PEPPER;
    return bcrypt.compareSync(keyWithPepper, hashedKey);
  }
  _getAllKeys() {
    const dbData = this._readDBFile();
    return dbData.keys || [];
  }
  _createKey(username) {
    if (!username) {
      return {
        message: "Username is required to create an API key",
        status: "error",
      };
    } else if (!this.users.includes(username)) {
      return {
        message: "Unauthorized: Username not recognized",
        status: "error",
      };
    }
    const rawKey = this._generateRawKey();
    const hashedKey = this._hashKey(rawKey);
    const db = this._readDBFile();
    db.keys.push({
      username: username,
      keyHash: hashedKey,
      createdAt: new Date().toISOString(),
    });
    const writeResult = this._writeDBFile(db);
    if (writeResult.status === "success") {
      return {
        message: "API key created successfully",
        status: "success",
        apiKey: rawKey,
      };
    } else {
      return writeResult;
    }
  }
  _verify(rawKey) {
    if (!rawKey.startsWith(this.API_KEY_PREFIX)) {
      return false;
    }
    const db = this._readDBFile();
    const toDelete = [];
    for (const entry of db.keys) {
      if (this._is_expired(entry.createdAt)) {
        toDelete.push(entry.keyHash);
        continue;
      } else if (this._validateHash(rawKey, entry.keyHash)) {
        return true;
      }
    }
    for (const keyHash of toDelete) {
      this._deleteKeyByHash(keyHash);
    }
    return false;
  }
  _deleteKeyByHash(keyHash) {
    const db = this._readDBFile();
    const keyIndex = db.keys.findIndex((entry) => entry.keyHash === keyHash);
    if (keyIndex === -1) {
      return {
        message: "API key not found",
        status: "error",
      };
    }
    db.keys.splice(keyIndex, 1);
    const writeResult = this._writeDBFile(db);
    if (writeResult.status === "success") {
      return {
        message: "API key deleted successfully",
        status: "success",
      };
    } else {
      return writeResult;
    }
  }
  _deleteKey(rawKey) {
    if (!rawKey.startsWith(this.API_KEY_PREFIX)) {
      return {
        message: "Invalid API key",
        status: "error",
      };
    }
    const db = this._readDBFile();
    const initialLength = db.keys.length;
    const keyIndex = db.keys.findIndex((entry) =>
      this._validateHash(rawKey, entry.keyHash)
    );
    if (keyIndex === -1) {
      return {
        message: "API key not found",
        status: "error",
      };
    }
    db.keys.splice(keyIndex, 1);
    const writeResult = this._writeDBFile(db);
    if (writeResult.status === "success") {
      return {
        message: "API key deleted successfully",
        status: "success",
      };
    } else {
      return writeResult;
    }
  }
  _getEachUserAPIUsage() {}
  createKey(username) {
    return this._createKey(username);
  }
  generateApiKey(username) {
    return this._createKey(username);
  }
  verifyKey(rawKey) {
    return this._verify(rawKey);
  }
  validateApiKey(rawKey) {
    if (this._verify(rawKey)) {
      return {
        message: "API key is valid",
        status: "success",
      };
    } else {
      return {
        message: "Invalid API key",
        status: "error",
      };
    }
  }
  deleteKey(rawKey) {
    return this._deleteKey(rawKey);
  }
}

module.exports = { APIKeyUtils };
