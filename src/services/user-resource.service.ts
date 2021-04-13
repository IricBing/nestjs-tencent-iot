import { Inject, Injectable } from '@nestjs/common';
import { IOT_CLIENT_PROVIDER } from '../constants/common.constant';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_client';
import { GetUserResourceInfoResponse } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_models';

@Injectable()
export class TencentIotUserResourceService {
  constructor(
    @Inject(IOT_CLIENT_PROVIDER)
    private readonly iotClient: Client
  ) {}

  /**
   * 获取账号资源信息
   * @returns 账号资源信息
   */
  async info(): Promise<GetUserResourceInfoResponse> {
    return this.iotClient.GetUserResourceInfo({} as null);
  }
}
