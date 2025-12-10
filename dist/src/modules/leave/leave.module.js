"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const employee_module_1 = require("../employee/employee.module");
const notification_module_1 = require("../../common/modules/notification.module");
const leave_period_controller_1 = require("./controllers/leave-period.controller");
const leave_type_controller_1 = require("./controllers/leave-type.controller");
const leave_balance_controller_1 = require("./controllers/leave-balance.controller");
const leave_request_controller_1 = require("./controllers/leave-request.controller");
const leave_period_service_1 = require("./services/leave-period.service");
const leave_type_service_1 = require("./services/leave-type.service");
const leave_balance_service_1 = require("./services/leave-balance.service");
const leave_request_service_1 = require("./services/leave-request.service");
const leave_email_service_1 = require("./services/leave-email.service");
const leave_period_repository_1 = require("./repositories/leave-period.repository");
const leave_type_repository_1 = require("./repositories/leave-type.repository");
const leave_balance_repository_1 = require("./repositories/leave-balance.repository");
const leave_request_repository_1 = require("./repositories/leave-request.repository");
let LeaveModule = class LeaveModule {
};
exports.LeaveModule = LeaveModule;
exports.LeaveModule = LeaveModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, employee_module_1.EmployeeModule, notification_module_1.NotificationModule],
        controllers: [
            leave_period_controller_1.LeavePeriodController,
            leave_type_controller_1.LeaveTypeController,
            leave_balance_controller_1.LeaveBalanceController,
            leave_request_controller_1.LeaveRequestController,
        ],
        providers: [
            leave_period_service_1.LeavePeriodService,
            leave_type_service_1.LeaveTypeService,
            leave_balance_service_1.LeaveBalanceService,
            leave_request_service_1.LeaveRequestService,
            leave_email_service_1.LeaveEmailService,
            leave_period_repository_1.LeavePeriodRepository,
            leave_type_repository_1.LeaveTypeRepository,
            leave_balance_repository_1.LeaveBalanceRepository,
            leave_request_repository_1.LeaveRequestRepository,
        ],
        exports: [
            leave_period_service_1.LeavePeriodService,
            leave_type_service_1.LeaveTypeService,
            leave_balance_service_1.LeaveBalanceService,
            leave_request_service_1.LeaveRequestService,
        ],
    })
], LeaveModule);
//# sourceMappingURL=leave.module.js.map