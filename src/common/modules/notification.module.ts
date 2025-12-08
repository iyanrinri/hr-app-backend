import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaService } from '../services/kafka.service';
import { NotificationService } from '../services/notification.service';
import { NotificationGateway } from '../gateways/notification.gateway';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    KafkaService,
    NotificationService,
    NotificationGateway,
  ],
  exports: [
    KafkaService,
    NotificationService,
    NotificationGateway,
  ],
})
export class NotificationModule {}