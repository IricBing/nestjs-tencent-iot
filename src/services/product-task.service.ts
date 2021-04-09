import { Inject, Injectable } from '@nestjs/common';
import { IOT_CLIENT_PROVIDER } from '../constants/common.constant';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_client';
import { DescribeProductTaskResponse, DescribeProductTasksResponse } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_models';

@Injectable()
export class TencentIotProductTaskService {
  constructor(
    @Inject(IOT_CLIENT_PROVIDER)
    private readonly iotClient: Client
  ) {}

  /**
   * 获取产品级任务详情
   * @param productId 产品ID
   * @param taskId 产品ID
   * @returns 产品级任务详情
   */
  async getDetail(productId: string, taskId: number): Promise<DescribeProductTaskResponse> {
    return this.iotClient.DescribeProductTask({ ProductId: productId, TaskId: taskId });
  }

  /**
   * 获取产品级任务列表
   * @param productId 产品ID
   * @param offset 产品级别任务列表偏移量
   * @param limit 产品级别任务列表拉取个数
   * @returns 产品级任务列表
   */
  async getList(productId: string, offset: number, limit: number): Promise<DescribeProductTasksResponse> {
    return this.iotClient.DescribeProductTasks({ ProductId: productId, Offset: offset, Limit: limit });
  }
}
