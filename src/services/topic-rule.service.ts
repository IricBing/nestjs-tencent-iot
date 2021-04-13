import { Inject, Injectable } from '@nestjs/common';
import { IOT_CLIENT_PROVIDER } from '../constants/common.constant';
import { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_client';
import {
  CreateTopicRuleResponse,
  TopicRulePayload,
  EnableTopicRuleResponse,
  DisableTopicRuleResponse,
  DeleteTopicRuleResponse,
  ReplaceTopicRuleResponse
} from 'tencentcloud-sdk-nodejs/tencentcloud/services/iotcloud/v20180614/iotcloud_models';

@Injectable()
export class TencentIotTopicRuleService {
  constructor(
    @Inject(IOT_CLIENT_PROVIDER)
    private readonly iotClient: Client
  ) {}

  /**
   * 创建规则引擎
   * @param name 规则引擎名称
   * @param payload 规则内容
   * @returns 规则引擎创建结果
   */
  async create(name: string, payload: TopicRulePayload): Promise<CreateTopicRuleResponse> {
    return this.iotClient.CreateTopicRule({
      RuleName: name,
      TopicRulePayload: payload
    });
  }

  /**
   * 删除规则引擎
   * @param name 规则引擎名称
   * @returns 删除结果
   */
  async delete(name: string): Promise<DeleteTopicRuleResponse> {
    return this.iotClient.DeleteTopicRule({ RuleName: name });
  }

  /**
   * 替换规则
   * @param name 规则名称
   * @param payload 替换的规则包体
   * @param modifyType 修改类型，0：其他，1：创建行为，2：更新行为，3：删除行为
   * @param actionIndex action增删改变更填对应topicRulePayload里面第几个action
   * @returns 替换结果
   */
  async replace(name: string, payload: TopicRulePayload, modifyType?: 0 | 1 | 2 | 3, actionIndex?: number): Promise<ReplaceTopicRuleResponse> {
    return this.iotClient.ReplaceTopicRule({ RuleName: name, TopicRulePayload: payload, ModifyType: modifyType, ActionIndex: actionIndex });
  }

  /**
   * 启用规则引擎
   * @param name 规则引擎名称
   * @returns 启用结果
   */
  async enable(name: string): Promise<EnableTopicRuleResponse> {
    return this.iotClient.EnableTopicRule({ RuleName: name });
  }

  /**
   * 禁用规则引擎
   * @param name 规则引擎名称
   * @returns 禁用结果
   */
  async disable(name: string): Promise<DisableTopicRuleResponse> {
    return this.iotClient.DisableTopicRule({ RuleName: name });
  }
}
