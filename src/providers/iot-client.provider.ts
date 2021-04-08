import { Provider } from '@nestjs/common';
import { IOT_CLIENT_PROVIDER, OPTIONS_PROVIDER } from '../constants/common.constant';
import { TencentIotModuleOptions } from '../interfaces/options.interface';
import { iotcloud } from 'tencentcloud-sdk-nodejs';
import { IOT_CLOUD_ENDPOINT } from '../constants/iot-cloud.constant';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_client';

export const createTencentIotClientProvider = (): Provider => ({
  provide: IOT_CLIENT_PROVIDER,
  useFactory: async (options: TencentIotModuleOptions): Promise<Client> => {
    const IotCloudClient = iotcloud.v20180614.Client;
    return new IotCloudClient({
      credential: {
        secretId: options.user.secretId,
        secretKey: options.user.secretKey
      },
      region: options.region || '',
      profile: {
        httpProfile: {
          endpoint: options.endpoint || IOT_CLOUD_ENDPOINT
        }
      }
    });
  },
  inject: [OPTIONS_PROVIDER]
});
