import { Inject, Injectable } from '@nestjs/common';
import { IOT_CLIENT_PROVIDER } from '../constants/common.constant';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_client';
import { IricUtil } from '../utils/iric.util';
import { DescribeProductsResponse } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_models';

@Injectable()
export class TencentIotProductService {
  constructor(
    @Inject(IOT_CLIENT_PROVIDER)
    private readonly iotClient: Client,
    private readonly iricUtil: IricUtil
  ) {}

  /**
   * 获取产品列表
   * @param offset 偏移量，Offset从0开始
   * @param limit 分页大小，当前页面中显示的最大数量，值范围 10-250。
   * @returns 获取产品列表信息
   */
  async getList(offset: number, limit = 10): Promise<DescribeProductsResponse> {
    return this.iotClient.DescribeProducts({
      Offset: offset,
      Limit: limit
    });
  }
}
