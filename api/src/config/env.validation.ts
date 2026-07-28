import * as Joi from 'joi';

/**
 * Every environment variable the app needs, described in one place.
 *
 * @nestjs/config runs this schema at startup. If something is missing or
 * malformed the app refuses to boot with a clear message, rather than starting
 * up and failing later on the first request. Nothing here has a secret as its
 * default — a real value must be supplied.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  CORS_ORIGIN: Joi.string().uri().default('http://localhost:5173'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required().messages({
    'string.min': 'JWT_SECRET must be at least 32 characters',
  }),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
});
