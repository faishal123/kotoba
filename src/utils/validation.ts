import { z } from "zod";

export function createStringZodSchema(param: { required: true }): z.ZodString;
export function createStringZodSchema(param?: {
  required: false;
}): z.ZodOptional<z.ZodNullable<z.ZodString>>;

export function createStringZodSchema(param?: { required: boolean }) {
  const required = param?.required ?? false;
  let stringSchema = z.string();
  if (!required) {
    return stringSchema.nullish();
  }
  return stringSchema;
}
