import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TencentIotProductService } from './product.service';
import { TencentIotModule } from '../tencent-iot.module';
import { ConfigModule } from '../../test/modules/config/config.module';
import { CONFIG_PROVIDER } from '../../test/modules/config/constants/config.constant';
import { ConfigService } from '../../test/modules/config/services/config.service';
import { RegexUtil } from '../utils/regex.util';

describe('ProductService (async)', () => {
  let app: INestApplication;
  let productService: TencentIotProductService;
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
    productService = moduleFixture.get(TencentIotProductService);
    regexUtil = moduleFixture.get(RegexUtil);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let productId: string;
  const productName = '测试产品' + Date.now();

  it('创建产品', async () => {
    const { RequestId, ProductId, ProductName } = await productService.create(productName);
    expect(regexUtil.isUuid(RequestId)).toBe(true);
    expect(typeof ProductId).toBe('string');
    expect(ProductName).toEqual(productName);

    productId = ProductId;
  });

  it('获取产品列表', async () => {
    const { RequestId, Products } = await productService.getList(1, 10);
    expect(regexUtil.isUuid(RequestId)).toBe(true);
    expect(Products instanceof Array).toBe(true);
    expect(Products.find(product => product.ProductId === productId).ProductName).toEqual(productName);
  });

  it('删除产品', async () => {
    const { RequestId } = await productService.delete(productId);
    expect(regexUtil.isUuid(RequestId)).toBe(true);
  });
});
