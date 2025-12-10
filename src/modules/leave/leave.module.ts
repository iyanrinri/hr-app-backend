import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { EmployeeModule } from '../employee/employee.module';
import { NotificationModule } from '../../common/modules/notification.module';

// Controllers
import { LeavePeriodController } from './controllers/leave-period.controller';
import { LeaveTypeController } from './controllers/leave-type.controller';
import { LeaveBalanceController } from './controllers/leave-balance.controller';
import { LeaveRequestController } from './controllers/leave-request.controller';

// Services
import { LeavePeriodService } from './services/leave-period.service';
import { LeaveTypeService } from './services/leave-type.service';
import { LeaveBalanceService } from './services/leave-balance.service';
import { LeaveRequestService } from './services/leave-request.service';
import { LeaveEmailService } from './services/leave-email.service';

// Repositories
import { LeavePeriodRepository } from './repositories/leave-period.repository';
import { LeaveTypeRepository } from './repositories/leave-type.repository';
import { LeaveBalanceRepository } from './repositories/leave-balance.repository';
import { LeaveRequestRepository } from './repositories/leave-request.repository';

@Module({
  imports: [DatabaseModule, EmployeeModule, NotificationModule],
  controllers: [
    LeavePeriodController,
    LeaveTypeController,
    LeaveBalanceController,
    LeaveRequestController,
  ],
  providers: [
    LeavePeriodService,
    LeaveTypeService,
    LeaveBalanceService,
    LeaveRequestService,
    LeaveEmailService,
    LeavePeriodRepository,
    LeaveTypeRepository,
    LeaveBalanceRepository,
    LeaveRequestRepository,
  ],
  exports: [
    LeavePeriodService,
    LeaveTypeService,
    LeaveBalanceService,
    LeaveRequestService,
  ],
})
export class LeaveModule {}