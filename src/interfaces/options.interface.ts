import { ModuleMetadata, Type } from '@nestjs/common';

/** 腾讯云子用户信息 */
interface TencentUserInfo {
  /** 子用户SecretId */
  secretId: string;
  /** 子用户SecretKey */
  secretKey: string;
}

/** 同步传入配置 */
export interface TencentIotModuleOptions {
  /** 子用户信息 */
  user: TencentUserInfo;
  /** 区域 */
  region?: string;
  /** 入口 */
  endpoint?: string;
}

export interface TencentIotOptionsFactory {
  createMpOptions(): TencentIotModuleOptions | Promise<TencentIotModuleOptions>;
}

/** 异步传入配置 */
export interface TencentIotModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<TencentIotOptionsFactory>;
  useClass?: Type<TencentIotOptionsFactory>;
  useFactory?: (...args: any[]) => TencentIotModuleOptions | Promise<TencentIotModuleOptions>;
  inject?: any[];
}
