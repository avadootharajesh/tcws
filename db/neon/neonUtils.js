// neonUtils.js

// imports
const neonconsts = require("./neonConsts");
const commonutils = require("../../utils/commonuitls");

// check table name validity
function CheckTableNameValidity(tablename) {
  if (
    !/^[A-Za-z][A-Za-z0-9_]*$/.test(tablename) ||
    tablename.length < 6 ||
    tablename.length > 64
  ) {
    return {
      status: false,
      message:
        "Invalid table name. (MIN_LEN = 6, MAX_LEN = 64, ALLOWED_CHARS = [A-Za-z0-9_], START_CHAR = [A-Za-z])",
    };
  }
  return {
    status: true,
    message: "Valid table name",
  };
}

function IncludePropsInAngularBraces(actualString, oldProp, newProp) {
  const openSeparator = "<";
  const closeSeparator = ">";
  const replacedString = commonutils.feedToString(
    openSeparator,
    closeSeparator,
    oldProp,
    actualString,
    newProp
  );
  return replacedString;
}
const IncludeTableNameInAngularBraces = (actualString, tablename) =>
  IncludePropsInAngularBraces(actualString, "tablename", tablename);

// create CREATE TABLE query
function FormQuery(args) {
  if (args.type == neonconsts.CHECK_IF_TABLE_EXISTS) {
    const outString = neonconsts.CHECK_IF_TABLE_EXISTS_QUERY;
    const inString = "tablename";
    const replaceString = args.tablename;
    const openSeparator = "<";
    const closeSeparator = ">";
    const replacedString = commonutils.feedToString(
      openSeparator,
      closeSeparator,
      inString,
      outString,
      replaceString
    );
    return replacedString;
  } else if (args.type == neonconsts.CREATE_TABLE) {
    const createString = neonconsts.CREATE_TABLE_QUERY;
  } else if (args.type == neonconsts.INSERT) {
    const tabledQuery = commonutils.feedToString(
      "<",
      ">",
      "tablename",
      neonconsts.INSERT_QUERY_SAFE,
      args.tablename
    );
    // cols = keys other than tablename and type
    const cols = Object.keys(args).filter(
      (key) => key !== "tablename" && key !== "type"
    );
    const colsString = cols.join(", ");
    const colsAddedQuery = commonutils.feedToString(
      "<",
      ">",
      "cols",
      tabledQuery,
      colsString
    );
    return colsAddedQuery;
  } else if (args.type == neonconsts.RESET_SERIAL0) {
    const tabledQuery = commonutils.feedToString(
      "<",
      ">",
      "tablename",
      neonconsts.RESET_SERIAL_QUERY1,
      args.tablename
    );
    return tabledQuery;
  } else if (args.type == neonconsts.RESET_SERIAL1) {
    const tabledQuery = commonutils.feedToString(
      "<",
      ">",
      "serial_sequence_name",
      neonconsts.RESET_SERIAL_QUERY2,
      args.serial_sequence_name
    );
    return tabledQuery;
  } else if (args.type == neonconsts.TRUNCATE_TABLE) {
    const tabledQuery = commonutils.feedToString(
      "<",
      ">",
      "tablename",
      neonconsts.TRUNCATE_TABLE_QUERY,
      args.tablename
    );
    return tabledQuery;
  } else if (args.type == neonconsts.DELETE_FROM_TABLE) {
    const tabledQuery = commonutils.feedToString(
      "<",
      ">",
      "tablename",
      neonconsts.DELETE_FROM_TABLE_QUERY,
      args.tablename
    );
    return tabledQuery;
  } else if (args.type == neonconsts.GET_ENTRY_BY_ID) {
    const tabledQuery = commonutils.feedToString(
      "<",
      ">",
      "tablename",
      neonconsts.SELECT_BY_ID_QUERY_SAFE,
      args.tablename
    );
    return tabledQuery;
  } else if (args.type == neonconsts.GET_ALL_ENTRIES) {
    const tabledQuery = commonutils.feedToString(
      "<",
      ">",
      "tablename",
      neonconsts.SELECT_ALL_QUERY,
      args.tablename
    );
    return tabledQuery;
  } else if (args.type == neonconsts.DELETE_ENTRY_BY_ID) {
    const tabledQuery = commonutils.feedToString(
      "<",
      ">",
      "tablename",
      neonconsts.DELETE_ENTRY_BY_ID_QUERY_SAFE,
      args.tablename
    );
    return tabledQuery;
  } else if (args.type == neonconsts.DROP_TABLE) {
    const tabledQuery = commonutils.feedToString(
      "<",
      ">",
      "tablename",
      neonconsts.DROP_TABLE_QUERY,
      args.tablename
    );
    return tabledQuery;
  } else if (args.type == neonconsts.QUERY_BY_FIELDS) {
    const tabledQuery = IncludeTableNameInAngularBraces(
      neonconsts.QUERY_BY_FIELDS_QUERY,
      args.tablename
    );
    // col-strings-with-index
    const colStrings = Object.keys(args.columnsQuery).map(
      (col, index) => `${col} = $${index + 1}`
    );
    let colString = "";
    colString = colStrings.join(" " + args.queryLogicalConnector + " ");
    const colAddedQuery = IncludePropsInAngularBraces(
      tabledQuery,
      "columnsQuery",
      colString
    );
    return colAddedQuery;
  }
}

// exports
module.exports = {
  CheckTableNameValidity,
  FormQuery,
};
