import { Inject, Injectable } from '@nestjs/common';
import { IOT_CLIENT_PROVIDER } from '../constants/common.constant';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_client';
import { DescribeDevicesResponse } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_models';

@Injectable()
export class TencentIotDeviceService {
  constructor(
    @Inject(IOT_CLIENT_PROVIDER)
    private readonly iotClient: Client
  ) {}

  /**
   * 查询设备列表
   * @param productId 需要查看设备列表的产品 ID
   * @param offset 偏移量，Offset从0开始
   * @param limit 分页的大小，数值范围 10-250
   * @param firmwareVersion 设备固件版本号，若不带此参数会返回所有固件版本的设备。传"None-FirmwareVersion"查询无版本号的设备
   * @param deviceName 需要过滤的设备名称
   * @param enableState 设备是否启用，0禁用状态1启用状态，默认不区分
   * @returns 设备列表查询结果
   */
  async getList(productId: string, offset: number, limit: number, firmwareVersion?: string, deviceName?: string, enableState?: string): Promise<DescribeDevicesResponse> {
    const params = {
      ProductId: productId,
      Offset: offset,
      Limit: limit
    };
    if (firmwareVersion) Object.assign(params, { FirmwareVersion: firmwareVersion });
    if (deviceName) Object.assign(params, { DeviceName: deviceName });
    if (enableState) Object.assign(params, { EnableState: enableState });

    return this.iotClient.DescribeDevices(params);
  }
}
