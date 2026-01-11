// imports
const t1schema = require("./t1");

// objects
const visibleSchema = {
    T1 : t1schema.T1VisibleSchema
};
const internalSchema = {
    T1 : t1schema.T1InternalSchema
};

// exports
module.exports = {
    VISIBLE_SCHEMA : visibleSchema,
    INTERNAL_SCHEMA : internalSchema
};