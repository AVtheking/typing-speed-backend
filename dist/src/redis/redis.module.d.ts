import { DynamicModule } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
export declare const REDIS_CLIENT_TOKEN = "REDIS_CLIENT_TOKEN";
export type RedisModuleOptions = RedisOptions;
export declare class RedisModule {
    static forRoot(options?: RedisModuleOptions): DynamicModule;
}
