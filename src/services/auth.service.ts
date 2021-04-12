import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { OPTIONS_PROVIDER } from '../constants/common.constant';
import { TencentIotModuleOptions } from '../interfaces/options.interface';

@Injectable()
export class TencentIotAuthService {
  constructor(
    @Inject(OPTIONS_PROVIDER)
    private readonly options: TencentIotModuleOptions
  ) {}

  /**
   * 签名校验
   * @param signature 签名字符串
   * @param nonce 随机数
   * @param timestamp 时间戳
   * @returns 签名校验结果
   */
  checkSignature(signature: string, nonce: string, timestamp: number): boolean {
    return createHash('sha1').update([timestamp, nonce, this.options.token].sort().join('')).digest('hex') === signature;
  }
}
