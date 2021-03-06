import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { OPTIONS_PROVIDER } from './constants/common.constant';
import { TencentIotModuleOptions, TencentIotModuleAsyncOptions, TencentIotOptionsFactory } from './interfaces/options.interface';
import { createTencentIotClientProvider } from './providers/iot-client.provider';
import { TencentIotAuthService } from './services/auth.service';
import { TencentIotDeviceService } from './services/device.service';
import { TencentIotMqttService } from './services/mqtt.service';
import { TencentIotProductTaskService } from './services/product-task.service';
import { TencentIotProductService } from './services/product.service';
import { TencentIotTaskService } from './services/task.service';
import { TencentIotTopicRuleService } from './services/topic-rule.service';
import { TencentIotUserResourceService } from './services/user-resource.service';
import { IricUtil } from './utils/iric.util';
import { RegexUtil } from './utils/regex.util';

@Global()
@Module({})
export class TencentIotCoreModule {
  /**
   * 同步方式配置
   * @param options 配置信息
   * @returns 动态模块
   */
  static forRoot(options: TencentIotModuleOptions): DynamicModule {
    return {
      module: TencentIotCoreModule,
      providers: [
        TencentIotAuthService,
        TencentIotProductService,
        TencentIotMqttService,
        TencentIotDeviceService,
        TencentIotTaskService,
        TencentIotProductTaskService,
        TencentIotTopicRuleService,
        TencentIotUserResourceService,
        IricUtil,
        RegexUtil,
        createTencentIotClientProvider(),
        { provide: OPTIONS_PROVIDER, useValue: options }
      ],
      exports: [
        TencentIotAuthService,
        TencentIotProductService,
        TencentIotMqttService,
        TencentIotDeviceService,
        TencentIotTaskService,
        TencentIotProductTaskService,
        TencentIotTopicRuleService,
        TencentIotUserResourceService
      ]
    };
  }

  /**
   * 异步方式配置
   * @param options 配置信息
   * @returns 动态模块
   */
  static forRootAsync(options: TencentIotModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: TencentIotCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        TencentIotAuthService,
        TencentIotProductService,
        TencentIotMqttService,
        TencentIotDeviceService,
        TencentIotTaskService,
        TencentIotProductTaskService,
        TencentIotTopicRuleService,
        TencentIotUserResourceService,
        IricUtil,
        RegexUtil,
        createTencentIotClientProvider()
      ],
      exports: [
        TencentIotAuthService,
        TencentIotProductService,
        TencentIotMqttService,
        TencentIotDeviceService,
        TencentIotTaskService,
        TencentIotProductTaskService,
        TencentIotTopicRuleService,
        TencentIotUserResourceService
      ]
    };
  }

  /**
   * 创建异步Provider列表
   * @param options 异步配置
   * @returns Provider列表
   */
  private static createAsyncProviders(options: TencentIotModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass
      }
    ];
  }

  /**
   * 创建异步Provider
   * @param options 异步配置
   * @returns Provider
   */
  private static createAsyncOptionsProvider(options: TencentIotModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: OPTIONS_PROVIDER,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }
    const inject = [options.useClass || options.useExisting];
    return {
      provide: OPTIONS_PROVIDER,
      useFactory: async (optionsFactory: TencentIotOptionsFactory) => await optionsFactory.createMpOptions(),
      inject
    };
  }
}
