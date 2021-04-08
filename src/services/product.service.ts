import { Inject, Injectable } from '@nestjs/common';
import { IOT_CLIENT_PROVIDER } from '../constants/common.constant';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_client';
import { IricUtil } from '../utils/iric.util';
import { DescribeProductsResponse, ProductProperties, CreateProductResponse, DeleteProductResponse } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_models';

@Injectable()
export class TencentIotProductService {
  constructor(
    @Inject(IOT_CLIENT_PROVIDER)
    private readonly iotClient: Client,
    private readonly iricUtil: IricUtil
  ) {}

  /**
   * 创建产品
   * @param name 产品名称，名称不能和已经存在的产品名称重复。命名规则：[a-zA-Z0-9:_-]{1,32}
   * @param properties 产品属性
   * @param skey 创建CLAA产品时，需要Skey
   * @returns 创建产品结果
   */
  async create(name: string, properties?: ProductProperties, skey?: string): Promise<CreateProductResponse> {
    return this.iotClient.CreateProduct({
      ProductName: name,
      ProductProperties: properties,
      Skey: skey
    });
  }

  /**
   * 删除产品
   * @param productId 需要删除的产品 ID
   * @param skey 删除LoRa产品需要skey
   * @returns 删除产品结果
   */
  async delete(productId: string, skey?: string): Promise<DeleteProductResponse> {
    return this.iotClient.DeleteProduct({ ProductId: productId, Skey: skey });
  }

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
