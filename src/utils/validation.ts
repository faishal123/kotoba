import { z } from "zod";

interface StringSchemaOptions {
  required?: boolean;
  json?: boolean;
  min?: number;
  max?: number;
}

export function createStringZodSchema(param: {
  required: true;
  [key: string]: any;
}): z.ZodType<string>;
export function createStringZodSchema(param?: {
  required?: false;
  [key: string]: any;
}): z.ZodOptional<z.ZodNullable<z.ZodType<string>>>;

export function createStringZodSchema(param?: StringSchemaOptions) {
  const required = param?.required ?? false;
  const json = param?.json ?? false;
  let stringSchema = z.string();

  if (param?.min !== undefined) {
    stringSchema = stringSchema.min(param.min);
  }
  if (param?.max !== undefined) {
    stringSchema = stringSchema.max(param.max);
  }

  let finalSchema: z.ZodType<string> = stringSchema;
  if (json) {
    finalSchema = finalSchema.refine(
      (val) => {
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Must be a valid JSON string" },
    );
  }

  if (!required) {
    return finalSchema.nullish();
  }

  return finalSchema;
}
