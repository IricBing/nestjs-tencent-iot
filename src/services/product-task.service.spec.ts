import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../test/modules/config/config.module';
import { CONFIG_PROVIDER } from '../../test/modules/config/constants/config.constant';
import { ConfigService } from '../../test/modules/config/services/config.service';
import { TencentIotModule } from '../tencent-iot.module';
import { RegexUtil } from '../utils/regex.util';
import { TencentIotProductTaskService } from './product-task.service';

describe('ProductTaskService (async)', () => {
  let app: INestApplication;
  let productTaskService: TencentIotProductTaskService;
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
    productTaskService = moduleFixture.get(TencentIotProductTaskService);
    regexUtil = moduleFixture.get(RegexUtil);
    configService = moduleFixture.get(CONFIG_PROVIDER);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // it('获取产品级任务详情', async () => {
  //   const { RequestId } = await productTaskService.getDetail(configService.test.iotCloud.productId, 1);
  //   expect(regexUtil.isUuid(RequestId)).toBe(true);
  // });

  it('获取产品级任务列表', async () => {
    const { RequestId, TotalCount, TaskInfos } = await productTaskService.getList(configService.test.iotCloud.productId, 0, 10);
    expect(regexUtil.isUuid(RequestId)).toBe(true);
    expect(TotalCount).toBeGreaterThanOrEqual(0);
    expect(TaskInfos instanceof Array).toBe(true);
  });
});
