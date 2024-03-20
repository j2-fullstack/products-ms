import 'dotenv/config';
import * as joi from 'joi';

interface EnvVarsOptions {
  PORT: number;
  DATABASE_URL: string;

  NATS_SERVERS: string[];
}

const envsSchemaValidator = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    //se valida que sea un array y que cada elemento sea un string.
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

//const { error, value } = envsSchemaValidator.validate(process.env);
const { error, value } = envsSchemaValidator.validate({
  ...process.env,
  //Para crear un array de nats servers basado en la variable de entorno NATS_SERVERS='nats://localhost:4222,nats://localhost:4223'
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if (error) {
  throw new Error(`Config envs validation error: ${error.message}`);
}
const envVars: EnvVarsOptions = value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
  natServers: envVars.NATS_SERVERS,
};
