import { DynamicModule, Module } from '@nestjs/common';
import { TencentIotModuleAsyncOptions, TencentIotModuleOptions } from './interfaces/options.interface';
import { TencentIotCoreModule } from './tencent-iot-core.module';

@Module({})
export class TencentIotModule {
  /**
   * 同步方式配置
   * @param options 配置信息
   * @returns 动态模块
   */
  static forRoot(options: TencentIotModuleOptions): DynamicModule {
    return {
      module: TencentIotModule,
      imports: [TencentIotCoreModule.forRoot(options)]
    };
  }

  /**
   * 异步方式配置
   * @param options 配置信息
   * @returns 动态模块
   */
  static forRootAsync(options: TencentIotModuleAsyncOptions): DynamicModule {
    return {
      module: TencentIotModule,
      imports: [TencentIotCoreModule.forRootAsync(options)]
    };
  }
}
