// t1 zSchema
const { z } = require("zod");

// des minlen = 10, maxlen = 5000
// ans minlen = 1, maxlen = 256
const T1VisibleSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(5000, "Description must be at most 5000 characters long"),
  answer: z
    .string()
    .min(1, "Answer must be at least 1 character long")
    .max(256, "Answer must be at most 256 characters long"),
});

const T1InternalSchema = z.object({});

module.exports = {
  T1VisibleSchema,
  T1InternalSchema,
};
