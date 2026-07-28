import * as Joi from 'joi';

/**
 * Validated at boot, so a missing or weak secret fails fast instead of
 * silently falling back to a default. The old Express server hardcoded
 * `user: "root", password: ""` in source and signed JWTs with the literal
 * string 'TOKEN'.
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
