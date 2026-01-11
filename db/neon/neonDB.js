const { Pool } = require("pg");

// load environment variables
require("dotenv").config();

// create a new pool
class NewPoolClass {
  static #instance = null;
  constructor() {
    if (NewPoolClass.#instance) {
      return NewPoolClass.#instance;
    }
    this.pool = new Pool({
      connectionString: process.env.NEON1_CONNECTION_STRING,
    });
    NewPoolClass.#instance = this;
  }
  query(command, params) {
    return this.pool.query(command, params);
  }
}

// create a new pool
const newPool = new NewPoolClass();

// export the pool
module.exports = {
  query: (command, params) => newPool.query(command, params),
  pool: newPool.pool,
};
