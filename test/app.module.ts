import { Module } from '@nestjs/common';
import { TencentIotModule } from '../src/tencent-iot.module';
import { ConfigModule } from './modules/config/config.module';
import { CONFIG_PROVIDER } from './modules/config/constants/config.constant';
import { ConfigService } from './modules/config/services/config.service';

@Module({
  imports: [
    TencentIotModule.forRoot({
      user: {
        secretId: '腾讯云子用户SecretId',
        secretKey: '腾讯云子用户SecretKey'
      },
      token: '数据转发到第三方服务器校验token'
    }),
    TencentIotModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        user: {
          secretId: configService.tencent.cam.user.secretId,
          secretKey: configService.tencent.cam.user.secretKey
        },
        token: configService.tencent.iothub.token
      }),
      inject: [CONFIG_PROVIDER]
    }),
    ConfigModule
  ]
})
export class AppModule {}
