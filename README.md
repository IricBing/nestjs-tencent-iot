# NestJS 腾讯云 `物联网通信` 服务插件

注意：<font color="#dd0000">仍在开发中，目前仅在内部使用</font><br /> 

## 使用说明

外部人员仅供参考，请不要用于生产环境，因此导致的事故后果请自行承担。

### 支持环境

* node >=`14.x`

### 安装

``` shell
$ npm i @lantsang/nestjs-tencent-iot

or
$ yarn add @lantsang/nestjs-tencent-iot  # 推荐使用yarn
```

### 配置

#### 同步方式

``` typescript
import { Module } from '@nestjs/common';
import { TencentIotModule } from '@lantsang/nestjs-tencent-iot'

@Module({
  imports: [
    TencentIotModule.forRoot({
      user: {
        secretId: '腾讯云子用户SecretId',
        secretKey: '腾讯云子用户SecretKey'
      },
      token: '数据转发到第三方服务器校验token'  // 选填，当在规则引擎中启用数据转发到第三方服务器时必填！
    })
  ]
})
export class AppModule { }
```

#### 异步方式

``` typescript
import { Module } from '@nestjs/common';
import { TencentIotModule } from '@lantsang/nestjs-tencent-iot'
import { ConfigModule } from './modules/config/config.module';
import { CONFIG_PROVIDER } from './modules/config/constants/config.constant';
import { ConfigService } from './modules/config/services/config.service';

@Module({
  imports: [
    TencentIotModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        user: {
          secretId: configService.tencent.cam.user.secretId,
          secretKey: configService.tencent.cam.user.secretKey
        },
        token: configService.tencent.iothub.token // 选填，当在规则引擎中启用数据转发到第三方服务器时必填！
      }),
      inject: [CONFIG_PROVIDER]
    }),
    ConfigModule
  ]
})
export class AppModule {}
```

> 提示：异步注册方式采用的 `ConfigModule` 并不是 `NestJS` 自带的配置功能，而是我基于官方自己设计的一套，具体实现请参考笔记：[NestJS配置模块设计](https://github.com/IricBing/note/blob/master/NodeJS/NestJS/%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1/%E9%85%8D%E7%BD%AE%E6%A8%A1%E5%9D%97%E8%AE%BE%E8%AE%A1/README.md)

## 文档地址

* [私有Gitlab](https://gitlab.lantsang.cn/nestjs-plugins/nestjs-tencent-iot/tree/master/docs)
* [GitHub](https://github.com/lantsang/nestjs-tencent-iot/tree/master/docs)
* [Gitee](https://gitee.com/lantsang/nestjs-tencent-iot/tree/master/docs)
