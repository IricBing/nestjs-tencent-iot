# 数据转发至第三方服务器 `token` 认证

官方要求第三方服务器要进行 `token` 认证，认证方法已经封装于 `TencentIotAuthService` 类中，可通过如下方式引入：

``` typescript
import { TencentIotAuthService } from '@lantsang/nestjs-tencent-iot'
```

认证方法：

``` typescript
/**
 * 签名校验
 * @param signature 签名字符串
 * @param nonce 随机数
 * @param timestamp 时间戳
 * @returns 签名校验结果
 */
checkSignature(signature: string, nonce: string, timestamp: number): boolean {}
```
