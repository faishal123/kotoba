import { z } from "zod";

export const createStringZodSchema = (param?: { required?: boolean }) => {
  const required = param?.required;
  let stringSchema = z.string().nullish();
  if (required) {
    stringSchema = stringSchema.refine((val) => !!val);
  }
  return stringSchema;
};
