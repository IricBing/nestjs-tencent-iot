import { registerAs } from '@nestjs/config';

export const TestConfigRegister = registerAs('test', () => ({
  iotCloud: {
    productId: process.env.TEST_IOT_CLOUD_PRODUCT_ID,
    deviceName: process.env.TEST_IOT_CLOUD_DEVICE_NAME,
    topic: process.env.TEST_IOT_CLOUD_TOPIC
  }
}));
