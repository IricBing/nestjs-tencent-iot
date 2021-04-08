import { Injectable } from '@nestjs/common';

/** 自定义正则验证工具集 */
@Injectable()
export class RegexUtil {
  /**
   * 验证字符串是否为uuid格式（v4版）
   * @param uuid 要验证的字符
   */
  isUuid(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
  }

  /**
   * 检验字符串是否为MD5格式（小写，32位版）
   * @param md5 要验证的字符串
   */
  isMD5(md5: string): boolean {
    return /^[a-f0-9]{32}$/.test(md5);
  }
}
