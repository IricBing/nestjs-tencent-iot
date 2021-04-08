# `MQTT` 消息下发

`MQTT` 消息相关服务封装于 `TencentIotMqttService` 类中，可通过如下方式引入：

``` typescript
import { TencentIotMqttService } from '@lantsang/nestjs-mp'
```

## 发送主题消息

``` typescript
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
async publish(productId: string, deviceName: string, topic: string, payload: string, qos?: 0 | 1, payloadEncoding?: string): Promise<PublishMessageResponse> {}
```
