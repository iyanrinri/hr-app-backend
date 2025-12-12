"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const database_module_1 = require("./database/database.module");
const employee_module_1 = require("./modules/employee/employee.module");
const auth_module_1 = require("./modules/auth/auth.module");
const roles_module_1 = require("./modules/roles/roles.module");
const attendance_period_module_1 = require("./modules/attendance-period/attendance-period.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const settings_module_1 = require("./modules/settings/settings.module");
const leave_module_1 = require("./modules/leave/leave.module");
const salary_module_1 = require("./modules/salary/salary.module");
const overtime_module_1 = require("./modules/overtime/overtime.module");
const payroll_module_1 = require("./modules/payroll/payroll.module");
const notification_module_1 = require("./common/modules/notification.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            notification_module_1.NotificationModule,
            employee_module_1.EmployeeModule,
            auth_module_1.AuthModule,
            roles_module_1.RolesModule,
            attendance_period_module_1.AttendancePeriodModule,
            attendance_module_1.AttendanceModule,
            settings_module_1.SettingsModule,
            leave_module_1.LeaveModule,
            salary_module_1.SalaryModule,
            overtime_module_1.OvertimeModule,
            payroll_module_1.PayrollModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map