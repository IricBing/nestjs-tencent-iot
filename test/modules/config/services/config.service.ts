import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  /** 腾讯云相关配置 */
  get tencent() {
    return {
      /** 腾讯云子账户相关配置 */
      cam: {
        /** 腾讯云子账户 */
        user: {
          /** 腾讯云子账户用户名 */
          name: this.nestConfigService.get<string>('tencent.cam.user.name'),
          /** 腾讯云子账户SecretId */
          secretId: this.nestConfigService.get<string>('tencent.cam.user.secretId'),
          /** 腾讯云子账户SecretKey */
          secretKey: this.nestConfigService.get<string>('tencent.cam.user.secretKey')
        }
      },
      /** 腾讯云物联网通信相关信息 */
      iothub: {
        /** Token */
        token: this.nestConfigService.get<string>('tencent.iothub.token')
      }
    };
  }

  /** 测试相关配置 */
  get test() {
    return {
      /** 腾讯云物联网通信相关配置 */
      iotCloud: {
        /** 产品ID */
        productId: this.nestConfigService.get<string>('test.iotCloud.productId'),
        /** 产品名称 */
        deviceName: this.nestConfigService.get<string>('test.iotCloud.deviceName'),
        /** 下发Topic */
        topic: this.nestConfigService.get<string>('test.iotCloud.topic')
      }
    };
  }
}
