import * as Joi from 'joi';

/** .env文件校验 */
export const ConfigValidation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'staging').default('development'),

  // 腾讯云子用户信息
  TENCENT_CAM_USER_NAME: Joi.string().required(),
  TENCENT_CAM_USER_SECRET_ID: Joi.string().required(),
  TENCENT_CAM_USER_SECRET_KEY: Joi.string().required()
});
