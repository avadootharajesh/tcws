// neon DB consts
const neonConnectionString = process.env.NEON1_CONNECTION_STRING;

const CREATE_TABLE_QUERY = `
  CREATE TABLE IF NOT EXISTS <tablename> (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    answer VARCHAR(255)
  );
`;

const DELETE_FROM_TABLE_QUERY = `DELETE FROM "<tablename>";`;
const DELETE_FROM_TABLE_QUERY_SAFE = `DELETE FROM $1;`;
const TRUNCATE_TABLE_QUERY = `TRUNCATE TABLE "<tablename>";`;
const TRUNCATE_TABLE_QUERY_SAFE = `TRUNCATE TABLE $1;`;
const DROP_TABLE_QUERY = `DROP TABLE IF EXISTS "<tablename>";`;
const DROP_TABLE_QUERY_SAFE = `DROP TABLE IF EXISTS $1;`;
const DELETE_ENTRY_BY_ID_QUERY = `DELETE FROM "<tablename>" WHERE id = <id>;`;
const DELETE_ENTRY_BY_ID_QUERY_SAFE = `DELETE FROM "<tablename>" WHERE id = $1;`;

const INSERT_QUERY_SAFE = `INSERT INTO "<tablename>" (<cols>) VALUES ($1, $2) RETURNING *;`;

const SELECT_ALL_QUERY = `SELECT * FROM "<tablename>";`;
const SELECT_ALL_QUERY_SAFE = `SELECT * FROM $1;`;
const SELECT_BY_ID_QUERY = `SELECT * FROM "<tablename>" WHERE id = <id>;`;
const SELECT_BY_ID_QUERY_SAFE = `SELECT * FROM "<tablename>" WHERE id = $1;`;
const QUERY_BY_FIELDS_QUERY = `SELECT * FROM "<tablename>" WHERE <columnsQuery>;`;

const CHECK_IF_TABLE_EXISTS_FILMS_SCHEMA_QUERY = `SELECT EXISTS (SELECT 1 from information_schema.tables WHERE table_schema = 'public' AND table_name = '<tablename>');`;
const CHECK_IF_TABLE_EXISTS_FILMS_SCHEMA_QUERY_SAFE = `SELECT EXISTS (SELECT 1 from information_schema.tables WHERE table_schema = 'public' AND table_name = $1);`;

const RESET_SERIAL_QUERY1 = `SELECT pg_get_serial_sequence('"<tablename>"', 'id') as serial_sequence_name;`;
const RESET_SERIAL_QUERY2 =
  "ALTER SEQUENCE <serial_sequence_name> RESTART WITH 1;";

// enum consts
const CHECK_IF_TABLE_EXISTS = "checkIfTableExists";
const CREATE_TABLE = "createTable";
const INSERT = "insert";
const RESET_SERIAL0 = "resetSerial0";
const RESET_SERIAL1 = "resetSerial1";
const TRUNCATE_TABLE = "truncateTable";
const DELETE_FROM_TABLE = "deleteFromTable";
const DROP_TABLE = "dropTable";
const GET_ALL_ENTRIES = "getAllEntries";
const QUERY_BY_FIELDS = "queryByFields";
const GET_ENTRY_BY_ID = "getEntryByID";
const DELETE_ENTRY_BY_ID = "deleteEntryByID";

// tables
const SARCASTIC_DESCRIPTIONS_TABLE = "SarcasticDescriptionsT";

module.exports = {
  neonConnectionString,
  // queries
  CREATE_TABLE_QUERY,
  DROP_TABLE_QUERY,
  DROP_TABLE_QUERY_SAFE,
  INSERT_QUERY_SAFE,
  CHECK_IF_TABLE_EXISTS_FILMS_SCHEMA_QUERY,
  CHECK_IF_TABLE_EXISTS_FILMS_SCHEMA_QUERY_SAFE,
  RESET_SERIAL_QUERY1,
  RESET_SERIAL_QUERY2,
  // delete-queries
  TRUNCATE_TABLE_QUERY,
  TRUNCATE_TABLE_QUERY_SAFE,
  DELETE_FROM_TABLE_QUERY,
  DELETE_FROM_TABLE_QUERY_SAFE,
  DELETE_ENTRY_BY_ID_QUERY,
  DELETE_ENTRY_BY_ID_QUERY_SAFE,
  // select-queries
  SELECT_ALL_QUERY,
  SELECT_ALL_QUERY_SAFE,
  SELECT_BY_ID_QUERY,
  SELECT_BY_ID_QUERY_SAFE,
  QUERY_BY_FIELDS_QUERY,
  // enums
  CHECK_IF_TABLE_EXISTS,
  CREATE_TABLE,
  INSERT,
  RESET_SERIAL0,
  RESET_SERIAL1,
  TRUNCATE_TABLE,
  DELETE_FROM_TABLE,
  DROP_TABLE,
  GET_ALL_ENTRIES,
  GET_ENTRY_BY_ID,
  QUERY_BY_FIELDS,
  DELETE_ENTRY_BY_ID,
  // tables
  SARCASTIC_DESCRIPTIONS_TABLE,
};
