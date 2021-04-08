import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TencentIotModule } from '../tencent-iot.module';
import { ConfigModule } from '../../test/modules/config/config.module';
import { CONFIG_PROVIDER } from '../../test/modules/config/constants/config.constant';
import { ConfigService } from '../../test/modules/config/services/config.service';
import { RegexUtil } from '../utils/regex.util';
import { TencentIotMqttService } from './mqtt.service';

describe('MqttService (async)', () => {
  let app: INestApplication;
  let mqttService: TencentIotMqttService;
  let configService: ConfigService;
  let regexUtil: RegexUtil;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        TencentIotModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            user: {
              secretId: configService.tencent.cam.user.secretId,
              secretKey: configService.tencent.cam.user.secretKey
            }
          }),
          inject: [CONFIG_PROVIDER]
        }),
        ConfigModule
      ]
    }).compile();
    app = moduleFixture.createNestApplication();
    mqttService = moduleFixture.get(TencentIotMqttService);
    regexUtil = moduleFixture.get(RegexUtil);
    configService = moduleFixture.get(CONFIG_PROVIDER);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('下发Mqtt消息', () => {
    it('成功', async () => {
      const { RequestId } = await mqttService.publish(configService.test.iotCloud.productId, configService.test.iotCloud.deviceName, configService.test.iotCloud.topic, 'hello 单元测试内容');
      expect(regexUtil.isUuid(RequestId)).toBe(true);
    });
  });
});
