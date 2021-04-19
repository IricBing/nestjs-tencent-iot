import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../test/modules/config/config.module';
import { CONFIG_PROVIDER } from '../../test/modules/config/constants/config.constant';
import { ConfigService } from '../../test/modules/config/services/config.service';
import { TencentIotModule } from '../tencent-iot.module';
import { RegexUtil } from '../utils/regex.util';
import { TencentIotDeviceService } from './device.service';

describe('DeviceService (async)', () => {
  let app: INestApplication;
  let deviceService: TencentIotDeviceService;
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
    deviceService = moduleFixture.get(TencentIotDeviceService);
    regexUtil = moduleFixture.get(RegexUtil);
    configService = moduleFixture.get(CONFIG_PROVIDER);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const name = 'test' + Date.now();

  it('创建设备', async () => {
    const { RequestId, DeviceName } = await deviceService.create(configService.test.iotCloud.productId, name);
    expect(DeviceName).toEqual(name);
    expect(regexUtil.isUuid(RequestId)).toBe(true);
  });

  it('更新可用状态', async () => {
    const { RequestId: RequestId1 } = await deviceService.updateAvailableState(configService.test.iotCloud.productId, name, 0);
    const { RequestId: RequestId2 } = await deviceService.updateAvailableState(configService.test.iotCloud.productId, name, 1);
    expect(regexUtil.isUuid(RequestId1)).toBe(true);
    expect(regexUtil.isUuid(RequestId2)).toBe(true);
  });

  it('重置设备状态', async () => {
    const { RequestId, SuccessCount, ResetDeviceResults } = await deviceService.resetState(configService.test.iotCloud.productId, [name]);
    expect(SuccessCount).toBe(1);
    expect(ResetDeviceResults.length).toBe(1);
    expect(regexUtil.isUuid(RequestId)).toBe(true);
  });

  it('获取设备详情', async () => {
    const { RequestId, DeviceName } = await deviceService.getDetail(configService.test.iotCloud.productId, name);
    expect(DeviceName).toEqual(name);
    expect(regexUtil.isUuid(RequestId)).toBe(true);
  });

  it('获取设备列表（某一特定产品下的）', async () => {
    const { RequestId, TotalCount, Devices } = await deviceService.getList(configService.test.iotCloud.productId, 0, 10);
    expect(regexUtil.isUuid(RequestId)).toBe(true);
    expect(TotalCount).toBeGreaterThanOrEqual(1);
    expect(typeof Devices.find(device => device.DeviceName === name)).toBe('object');
  });

  it('获取设备列表', async () => {
    const { RequestId, TotalCount, Devices } = await deviceService.getAllList(0, 10);
    expect(regexUtil.isUuid(RequestId)).toBe(true);
    expect(TotalCount).toBeGreaterThanOrEqual(1);
    expect(typeof Devices.find(device => device.DeviceName === name)).toBe('object');
  });

  it('删除设备', async () => {
    const { RequestId } = await deviceService.delete(configService.test.iotCloud.productId, name);
    expect(regexUtil.isUuid(RequestId)).toBe(true);
  });

  const nameList = ['test' + Date.now() + '1', 'test' + Date.now() + '2'];

  it(
    '批量创建设备',
    async () => {
      const { RequestId, TaskId } = await deviceService.batchCreate(configService.test.iotCloud.productId, nameList);
      expect(typeof TaskId).toEqual('string');
      expect(regexUtil.isUuid(RequestId)).toBe(true);

      let { TaskStatus } = await deviceService.getBatchCreateTaskStatus(configService.test.iotCloud.productId, TaskId);
      while (TaskStatus !== 2) {
        const request = await deviceService.getBatchCreateTaskStatus(configService.test.iotCloud.productId, TaskId);
        TaskStatus = request.TaskStatus;
      }

      const { TotalDevNum, DevicesInfo } = await deviceService.getBatchCreateResult(configService.test.iotCloud.productId, TaskId, 0, 10);
      expect(TotalDevNum).toBe(2);
      expect(DevicesInfo instanceof Array).toBe(true);

      for (const name of nameList) {
        const { RequestId } = await deviceService.delete(configService.test.iotCloud.productId, name);
        expect(regexUtil.isUuid(RequestId)).toBe(true);
      }
    },
    10 * 1000
  );
});
