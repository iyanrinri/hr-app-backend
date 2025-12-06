import { Module } from '@nestjs/common';
import { AttendancePeriodController } from './controllers/attendance-period.controller';
import { AttendancePeriodService } from './services/attendance-period.service';
import { AttendancePeriodScheduler } from './services/attendance-period.scheduler';
import { AttendancePeriodRepository } from './repositories/attendance-period.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AttendancePeriodController],
  providers: [AttendancePeriodService, AttendancePeriodScheduler, AttendancePeriodRepository],
  exports: [AttendancePeriodService, AttendancePeriodRepository],
})
export class AttendancePeriodModule {}