import { Inject, Injectable } from '@nestjs/common';
import { IOT_CLIENT_PROVIDER } from '../constants/common.constant';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_client';
import {
  DescribeDevicesResponse,
  Attribute,
  CreateDeviceResponse,
  DeleteDeviceResponse,
  CreateMultiDeviceResponse,
  DescribeMultiDevTaskResponse,
  DescribeMultiDevicesResponse,
  DescribeAllDevicesResponse,
  DescribeDeviceResponse,
  ResetDeviceStateResponse
} from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_models';

@Injectable()
export class TencentIotDeviceService {
  constructor(
    @Inject(IOT_CLIENT_PROVIDER)
    private readonly iotClient: Client
  ) {}

  /**
   * 创建设备
   * @param productId 产品 ID 。创建产品时腾讯云为用户分配全局唯一的 ID
   * @param name 设备名称。命名规则：[a-zA-Z0-9:_-]{1,48}。
   * @param definedPsk 是否使用自定义PSK，默认不使用
   * @param isp 运营商类型，当产品是NB-IoT产品时，此字段必填。1表示中国电信，2表示中国移动，3表示中国联通
   * @param imei IMEI，当产品是NB-IoT产品时，此字段必填
   * @param loraDevEui LoRa设备的DevEui，当创建LoRa时，此字段必填
   * @param loraMoteType LoRa设备的MoteType
   * @param skey 创建LoRa设备需要skey
   * @param loraAppKey LoRa设备的AppKey
   * @param attribute 设备属性
   * @returns 创建设备结果
   */
  async create(
    productId: string,
    name: string,
    definedPsk?: string,
    isp?: string,
    imei?: string,
    loraDevEui?: string,
    loraMoteType?: number,
    skey?: string,
    loraAppKey?: string,
    attribute?: Attribute
  ): Promise<CreateDeviceResponse> {
    const params = {
      ProductId: productId,
      DeviceName: name
    };
    if (definedPsk) Object.assign(params, { DefinedPsk: definedPsk });
    if (isp) Object.assign(params, { Isp: isp });
    if (imei) Object.assign(params, { Imei: imei });
    if (loraDevEui) Object.assign(params, { LoraDevEui: loraDevEui });
    if (loraMoteType) Object.assign(params, { LoraMoteType: loraMoteType });
    if (skey) Object.assign(params, { Skey: skey });
    if (loraAppKey) Object.assign(params, { LoraAppKey: loraAppKey });
    if (attribute) Object.assign(params, { Attribute: attribute });

    return this.iotClient.CreateDevice(params);
  }

  /**
   * 批量创建设备
   * @param productId 产品 ID。创建产品时腾讯云为用户分配全局唯一的 ID
   * @param nameList 批量创建的设备名数组，单次最多创建 100 个设备。命名规则：[a-zA-Z0-9:_-]{1,48}
   * @returns 批量创建设备任务信息
   */
  async batchCreate(productId: string, nameList: string[]): Promise<CreateMultiDeviceResponse> {
    return this.iotClient.CreateMultiDevice({
      ProductId: productId,
      DeviceNames: nameList
    });
  }

  /**
   * 删除设备
   * @param productId 设备所属的产品 ID
   * @param name 需要删除的设备名称
   * @param skey 删除LoRa设备以及LoRa网关设备需要skey
   * @returns 设备删除结果
   */
  async delete(productId: string, name: string, skey?: string): Promise<DeleteDeviceResponse> {
    const params = {
      ProductId: productId,
      DeviceName: name
    };
    if (skey) Object.assign(params, { Skey: skey });

    return this.iotClient.DeleteDevice(params);
  }

  /**
   * 批量重置设备状态
   * @param productId 产品ID
   * @param nameList 设备名称列表
   * @returns 状态重置结果
   */
  async resetState(productId: string, nameList: string[]): Promise<ResetDeviceStateResponse> {
    return this.iotClient.ResetDeviceState({ ProductId: productId, DeviceNames: nameList });
  }

  /**
   * 获取设备详细信息
   * @param productId 产品ID
   * @param name 设备名
   * @returns 设备详细信息
   */
  async getDetail(productId: string, name: string): Promise<DescribeDeviceResponse> {
    return this.iotClient.DescribeDevice({ ProductID: productId, DeviceName: name });
  }

  /**
   * 查询设备列表（某一特定产品下的）
   * @param productId 需要查看设备列表的产品 ID
   * @param offset 偏移量，Offset从0开始
   * @param limit 分页的大小，数值范围 10-250
   * @param firmwareVersion 设备固件版本号，若不带此参数会返回所有固件版本的设备。传"None-FirmwareVersion"查询无版本号的设备
   * @param deviceName 需要过滤的设备名称
   * @param enableState 设备是否启用，0禁用状态1启用状态，默认不区分
   * @returns 设备列表查询结果
   */
  async getList(productId: string, offset: number, limit: number, firmwareVersion?: string, deviceName?: string, enableState?: 0 | 1): Promise<DescribeDevicesResponse> {
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

  /**
   * 分页查询所有设备列表
   * @param offset 查询偏移量。
   * @param limit 查询设备数量。最大支持250个
   * @returns 所有设备列表——分页
   */
  async getAllList(offset: number, limit: number): Promise<DescribeAllDevicesResponse> {
    return this.iotClient.DescribeAllDevices({ Offset: offset, Limit: limit });
  }

  /**
   * 获取批量创建设备任务的状态
   * @param productId 产品 ID，创建产品时腾讯云为用户分配全局唯一的 ID
   * @param taskId 任务 ID，由批量创建设备接口返回
   * @returns 批量创建产品任务状态
   */
  async getBatchCreateTaskStatus(productId: string, taskId: string): Promise<DescribeMultiDevTaskResponse> {
    return this.iotClient.DescribeMultiDevTask({ ProductId: productId, TaskId: taskId });
  }

  /**
   * 分页获取批量创建结果
   * @param productId 产品 ID，创建产品时腾讯云为用户分配全局唯一的 ID
   * @param taskId 任务 ID，由批量创建设备接口返回
   * @param offset 分页偏移
   * @param limit 分页大小，每页返回的设备个数
   * @returns 获取批量创建结果——分页返回
   */
  async getBatchCreateResult(productId: string, taskId: string, offset: number, limit: number): Promise<DescribeMultiDevicesResponse> {
    return this.iotClient.DescribeMultiDevices({
      ProductId: productId,
      TaskId: taskId,
      Offset: offset,
      Limit: limit
    });
  }
}
