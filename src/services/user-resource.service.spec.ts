import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../test/modules/config/config.module';
import { CONFIG_PROVIDER } from '../../test/modules/config/constants/config.constant';
import { ConfigService } from '../../test/modules/config/services/config.service';
import { TencentIotModule } from '../tencent-iot.module';
import { RegexUtil } from '../utils/regex.util';
import { TencentIotUserResourceService } from './user-resource.service';

describe('UserResourceService (async)', () => {
  let app: INestApplication;
  let userResourceService: TencentIotUserResourceService;
  let regexUtil: RegexUtil;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        TencentIotModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            user: {
              secretId: configService.tencent.cam.user.secretId,
              secretKey: configService.tencent.cam.user.secretKey
            },
            token: configService.tencent.iothub.token
          }),
          inject: [CONFIG_PROVIDER]
        }),
        ConfigModule
      ]
    }).compile();
    app = moduleFixture.createNestApplication();
    userResourceService = moduleFixture.get(TencentIotUserResourceService);
    regexUtil = moduleFixture.get(RegexUtil);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('获取账号资源信息', async () => {
    const { RequestId, UsedSize, Limit } = await userResourceService.info();
    expect(typeof UsedSize).toBe('number');
    expect(typeof Limit).toBe('number');
    expect(regexUtil.isUuid(RequestId)).toBe(true);
  });
});
