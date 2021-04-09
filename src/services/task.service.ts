import { Inject, Injectable } from '@nestjs/common';
import { IOT_CLIENT_PROVIDER } from '../constants/common.constant';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_client';
import { DescribeTaskResponse } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_models';

@Injectable()
export class TencentIotTaskService {
  constructor(
    @Inject(IOT_CLIENT_PROVIDER)
    private readonly iotClient: Client
  ) {}

  /**
   * 获取任务详情
   * @param id 任务ID
   * @returns 任务详情
   */
  async getDetail(id: string): Promise<DescribeTaskResponse> {
    return this.iotClient.DescribeTask({ Id: id });
  }
}
