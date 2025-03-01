import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { CarModule } from './modules/core/car/car.module';
import { BrandModule } from './modules/supporting/brand/brand.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientAddressModule } from './modules/supporting/client-address/client-address.module';
import { SeederModule } from './modules/backoffice/seeder/seeder.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (
        configService: ConfigService,
      ): MongooseModuleFactoryOptions => {
        const user = configService.get('MONGO_USER') || 'root';
        const password = configService.get('MONGO_PASSWORD') || 'root';
        const host = configService.get('MONGO_HOST') || 'localhost';
        const port = configService.get('MONGO_PORT') || '27017';
        const database = configService.get('MONGO_DATABASE') || 'nest';

        return {
          uri: `mongodb://${user}:${password}@${host}:${port}`,
          dbName: database,
        };
      },
      inject: [ConfigService],
    }),
    CqrsModule.forRoot(),
    EventEmitterModule.forRoot({ global: true }),

    //core
    CarModule,

    //supporting
    BrandModule,
    ClientAddressModule,

    //backoffice
    SeederModule,
  ],
})
export class AppModule {}
