import { Inject, Injectable } from '@nestjs/common';
import { IOT_CLIENT_PROVIDER } from '../constants/common.constant';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_client';
import { PublishMessageResponse } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_models';

@Injectable()
export class TencentIotMqttService {
  constructor(
    @Inject(IOT_CLIENT_PROVIDER)
    private readonly iotClient: Client
  ) {}

  /**
   * MQTT消息下发
   * @param productId 产品ID
   * @param deviceName 设备名称
   * @param topic 消息发往的主题。命名规则：${ProductId}/${DeviceName}/[a-zA-Z0-9:_-]{1,128}
   * @param payload 消息内容
   * @param qos 服务质量等级，取值为0或1
   * @param payloadEncoding Payload内容的编码格式，取值为base64或空。base64表示云端将收到的请求数据进行base64解码后下发到设备，空则直接将原始内容下发到设备
   * @returns MQTT消息下发结果
   */
  async publish(productId: string, deviceName: string, topic: string, payload: string, qos?: 0 | 1, payloadEncoding?: string): Promise<PublishMessageResponse> {
    const params = {
      ProductId: productId,
      DeviceName: deviceName,
      Topic: topic,
      Payload: payload
    };
    if (qos) Object.assign(params, { Qos: qos });
    if (payloadEncoding) Object.assign(params, { PayloadEncoding: payloadEncoding });

    return this.iotClient.PublishMessage(params);
  }
}
