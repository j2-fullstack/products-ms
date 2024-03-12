import 'dotenv/config';
import * as joi from 'joi';

interface EnvVarsOptions {
  PORT: number;
  DATABASE_URL: string;
}

const envsSchemaValidator = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchemaValidator.validate(process.env);

if (error) {
  throw new Error(`Config envs validation error: ${error.message}`);
}
const envVars: EnvVarsOptions = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
};
