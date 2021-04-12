import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../test/modules/config/config.module';
import { CONFIG_PROVIDER } from '../../test/modules/config/constants/config.constant';
import { ConfigService } from '../../test/modules/config/services/config.service';
import { TencentIotModule } from '../tencent-iot.module';
import { RegexUtil } from '../utils/regex.util';
import { TencentIotAuthService } from './auth.service';

describe('AuthService (sync)', () => {
  let app: INestApplication;
  let authService: TencentIotAuthService;
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
            },
            token: configService.tencent.iothub.token
          }),
          inject: [CONFIG_PROVIDER]
        }),
        ConfigModule
      ]
    }).compile();
    app = moduleFixture.createNestApplication();
    authService = moduleFixture.get(TencentIotAuthService);
    regexUtil = moduleFixture.get(RegexUtil);
    configService = moduleFixture.get(CONFIG_PROVIDER);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('签名校验', async () => {
    const success = authService.checkSignature('c259ed29ec13ba7c649fe0893007401a36e70453', 'IkOaKMDalrAzUTxC', '1604458421');
    expect(success).toBe(true);
    const fail = authService.checkSignature('c259ed29ec13ba7c649fe0893007401a36e70453', 'IkOaKMDalrAzUTxC', '16044588421');
    expect(fail).toBe(false);
  });
});
