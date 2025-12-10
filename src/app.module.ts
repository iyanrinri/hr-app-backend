import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { AttendancePeriodModule } from './modules/attendance-period/attendance-period.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NotificationModule } from './common/modules/notification.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    NotificationModule,
    EmployeeModule,
    AuthModule,
    RolesModule,
    AttendancePeriodModule,
    AttendanceModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
