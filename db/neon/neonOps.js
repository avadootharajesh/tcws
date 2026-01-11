// neonOps
const neondb = require("./neonDB");

// imports
const neonconsts = require("./neonConsts");
const neonutils = require("./neonUtils");
const coreutils = require("../../utils/coreutils");
const zschemaconsts = require("../../zSchema/consts");

// check if table exists
async function CheckIfTableExists(tablename) {
  const isTableNameValidResponse = neonutils.CheckTableNameValidity(tablename);
  if (!isTableNameValidResponse.status) return isTableNameValidResponse;

  const queryString = neonutils.FormQuery({
    type: neonconsts.CHECK_IF_TABLE_EXISTS_FILMS_SCHEMA_QUERY,
    tablename: tablename,
  });
  const apiResponse = await neondb.query(
    neonconsts.CHECK_IF_TABLE_EXISTS_FILMS_SCHEMA_QUERY_SAFE,
    [tablename]
  );
  if (apiResponse.rows[0].exists) return true;
  else return false;
}

// create table
async function CreateTable(args) {
  const queryString = neonutils.FormQuery(args);
}

// insert into table
async function InsertIntoTable(args) {
  if (args.tablename == neonconsts.SARCASTIC_DESCRIPTIONS_TABLE) {
    const description = args.description;
    const answer = args.answer;
    const queryString = neonutils.FormQuery({
      type: neonconsts.INSERT,
      tablename: args.tablename,
      description: description,
      answer: answer,
    });
    const params = [description, answer];
    try {
      const apiResponse = await neondb.query(queryString, params);
      const responseReturnObject = {
        rowsAffected: apiResponse.rowCount,
        command: apiResponse.command,
        rows: apiResponse.rows,
      };
      return responseReturnObject;
    } catch (err) {
      const errorResponse = {
        status: false,
        message: err.message,
        severity: err.severity,
        code: err.code,
      };
      return errorResponse;
    }
  }

  return true;
}

async function BulkInsertIntoTable(args) {
  const tablename = args.tablename;
  const data = args.data;
  if (!data || data.length == 0) {
    return {
      status: false,
      message: "No data provided",
    };
  }
  const validRows = data.filter((row) => {
    const validateResponse = coreutils.validateSchema(zschemaconsts.T1, row);
    return validateResponse.success;
  });
  try {
    const results = await Promise.all(
      validRows.map((row) => {
        return InsertIntoTable({
          tablename: tablename,
          description: row.description,
          answer: row.answer,
        });
      })
    );
    console.log(results);
    return {
      status: true,
      message: "Data inserted successfully",
      affectedRowCount: results.length,
      results: results,
    };
  } catch (err) {
    return {
      status: false,
      error: err.message,
      message: "Error inserting data",
    };
  }
}

// update table
async function UpdateTable() {}

// delete table
async function DeleteTable() {}

// truncate table
async function TruncateTable(tablename) {
  const queryString = neonutils.FormQuery({
    type: neonconsts.TRUNCATE_TABLE,
    tablename: tablename,
  });
  let apiResponse = null;
  try {
    apiResponse = await neondb.query(queryString);
    // reset serial
    ResetSerial(tablename);
    return {
      status: true,
      message: "Table truncated successfully AND serial reset successfully",
    };
  } catch (err) {
    const errorResponse = {
      status: false,
      message: err.message,
      severity: err.severity,
      code: err.code,
    };
    console.log("Error Response", errorResponse);
    return errorResponse;
  }
}

// delete from table
async function DeleteFromTable(tablename) {
  const queryString = neonutils.FormQuery({
    type: neonconsts.DELETE_FROM_TABLE,
    tablename: tablename,
  });
  let apiResponse = null;
  try {
    apiResponse = await neondb.query(queryString);
    // reset serial
    ResetSerial(tablename);
    return {
      status: true,
      message: "Table truncated successfully and serial reset successfully",
    };
  } catch (err) {
    const errorResponse = {
      status: false,
      message: err.message,
      severity: err.severity,
      code: err.code,
    };
    console.log("Error Response", errorResponse);
    return errorResponse;
  }
}

async function DeleteEntryByID(tablename, id) {
  const queryString = neonutils.FormQuery({
    type: neonconsts.DELETE_ENTRY_BY_ID,
    tablename: tablename,
    id: id,
  });
  let apiResponse = null;
  try {
    apiResponse = await neondb.query(queryString, [id]);
    return {
      status: true,
      message: "Entry deleted successfully",
      apiResponse: apiResponse,
    };
  } catch (err) {
    const errorResponse = {
      status: false,
      message: err.message,
      severity: err.severity,
      code: err.code,
    };
    console.log("Error Response", errorResponse);
    return errorResponse;
  }
}

async function GetEntriesByFields(
  tablename,
  columnsQuery,
  queryLogicalConnector
) {
  const queryString = neonutils.FormQuery({
    type: neonconsts.QUERY_BY_FIELDS,
    tablename: tablename,
    columnsQuery: columnsQuery,
    queryLogicalConnector: queryLogicalConnector,
  });
  let colVals = Object.values(columnsQuery);
  let apiResponse = null;
  console.log("queryString", queryString);
  try {
    apiResponse = await neondb.query(queryString, colVals);
    return {
      status: true,
      message: "Data fetched successfully",
      rowCount: apiResponse.rowCount,
      data: apiResponse.rows,
    };
  } catch (err) {
    const errorResponse = {
      status: false,
      message: err.message,
      severity: err.severity,
      code: err.code,
    };
    console.log("Error Response", errorResponse);
    return errorResponse;
  }
}

// drop table
async function DropTable(tablename) {
  const queryString = neonutils.FormQuery({
    type: neonconsts.DROP_TABLE,
    tablename: tablename,
  });
  let apiResponse = null;
  try {
    apiResponse = await neondb.query(queryString);
    return {
      status: true,
      message: "Table dropped successfully",
      apiResponse: apiResponse,
    };
  } catch (err) {
    const errorResponse = {
      status: false,
      message: err.message,
      severity: err.severity,
      code: err.code,
    };
    console.log("Error Response", errorResponse);
    return errorResponse;
  }
}

// get Entry By ID
async function GetEntryByID(tablename, id) {
  const queryString = neonutils.FormQuery({
    type: neonconsts.GET_ENTRY_BY_ID,
    tablename: tablename,
    id: id,
  });
  let apiResponse = null;
  try {
    apiResponse = await neondb.query(queryString, [id]);
    return apiResponse.rows;
  } catch (err) {
    const errorResponse = {
      status: false,
      message: err.message,
      severity: err.severity,
      code: err.code,
    };
    console.log("Error Response", errorResponse);
    return errorResponse;
  }
}

async function GetAllEntriesFromTablename(tablename) {
  const queryString = neonutils.FormQuery({
    type: neonconsts.GET_ALL_ENTRIES,
    tablename: tablename,
  });
  let apiResponse = null;
  try {
    apiResponse = await neondb.query(queryString);
    return {
      status: true,
      message: "Data fetched successfully",
      rowCount: apiResponse.rowCount,
      data: apiResponse.rows,
    };
  } catch (err) {
    const errorResponse = {
      status: false,
      message: err.message,
      severity: err.severity,
      code: err.code,
    };
    console.log("Error Response", errorResponse);
    return errorResponse;
  }
}

// set id to 1
async function ResetSerial(tablename) {
  const queryString = neonutils.FormQuery({
    type: neonconsts.RESET_SERIAL0,
    tablename: tablename,
  });
  let apiResponse = null;
  try {
    apiResponse = await neondb.query(queryString);
    const serial_sequence_name = apiResponse.rows[0].serial_sequence_name;
    const queryString2 = neonutils.FormQuery({
      type: neonconsts.RESET_SERIAL1,
      serial_sequence_name: serial_sequence_name,
    });
    apiResponse = await neondb.query(queryString2);
    return {
      status: true,
      message: "Serial reset successfully",
    };
  } catch (err) {
    const errorResponse = {
      status: false,
      message: err.message,
      severity: err.severity,
      code: err.code,
    };
    console.log("Error Response", errorResponse);
    return errorResponse;
  }
}

// export
module.exports = {
  CheckIfTableExists,
  CreateTable,
  InsertIntoTable,
  BulkInsertIntoTable,
  UpdateTable,
  DeleteTable,
  GetEntryByID,
  ResetSerial,
  GetAllEntriesFromTablename,
  GetEntriesByFields,
  // delete-ops
  DeleteEntryByID,
  TruncateTable,
  DeleteFromTable,
  DropTable,
};
