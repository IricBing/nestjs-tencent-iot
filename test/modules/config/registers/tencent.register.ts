import { registerAs } from '@nestjs/config';

export const TencentConfigRegister = registerAs('tencent', () => ({
  cam: {
    user: {
      name: process.env.TENCENT_CAM_USER_NAME,
      secretId: process.env.TENCENT_CAM_USER_SECRET_ID,
      secretKey: process.env.TENCENT_CAM_USER_SECRET_KEY
    }
  }
}));
