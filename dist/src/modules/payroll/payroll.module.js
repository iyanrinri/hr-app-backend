"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollModule = void 0;
const common_1 = require("@nestjs/common");
const payroll_controller_1 = require("./controllers/payroll.controller");
const payroll_service_1 = require("./services/payroll.service");
const payroll_repository_1 = require("./repositories/payroll.repository");
const database_module_1 = require("../../database/database.module");
const salary_module_1 = require("../salary/salary.module");
const overtime_module_1 = require("../overtime/overtime.module");
const settings_module_1 = require("../settings/settings.module");
const attendance_module_1 = require("../attendance/attendance.module");
let PayrollModule = class PayrollModule {
};
exports.PayrollModule = PayrollModule;
exports.PayrollModule = PayrollModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            salary_module_1.SalaryModule,
            overtime_module_1.OvertimeModule,
            settings_module_1.SettingsModule,
            attendance_module_1.AttendanceModule,
        ],
        controllers: [payroll_controller_1.PayrollController],
        providers: [payroll_service_1.PayrollService, payroll_repository_1.PayrollRepository],
        exports: [payroll_service_1.PayrollService, payroll_repository_1.PayrollRepository],
    })
], PayrollModule);
//# sourceMappingURL=payroll.module.js.map