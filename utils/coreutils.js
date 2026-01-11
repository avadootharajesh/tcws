// APIJson Util

// validate schema
const { z } = require("zod");
const zschema = require("../zSchema/zSchema.js");
const zschemaconsts = require("../zSchema/consts.js");

const safeParse = (objectSchema, data) => {
  const result = objectSchema.safeParse(data);
  if (result.success) return result; // success: true, data
    else if (result.error) {
        return {
            error: result.error.name,
            message: result.error.message,
            status: handleResultUnsafeParse(result.error).status,
        }
    }
};
const unsafeParse = (objectSchema, data) => {
  try {
    return objectSchema.parse(data);
  } catch (error) {
    return error;
  }
};
const handleResultUnsafeParse = result => (result instanceof z.ZodError) ? zschemaconsts.failedSchemaParseResult : zschemaconsts.successfulSchemaParseResult;



const validateSchema = (dataType, data) => {
  // switch case
  switch (dataType) {
    case zschemaconsts.T1: return safeParse(zschema.VISIBLE_SCHEMA.T1, data);
    case zschemaconsts.T2: return safeParse(zschema.VISIBLE_SCHEMA.T2, data);
    default: return safeParse(zschema.VISIBLE_SCHEMA.T1, data);
  }
};

// exports
module.exports = {
  validateSchema,
};
