"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendancePeriodModule = void 0;
const common_1 = require("@nestjs/common");
const attendance_period_controller_1 = require("./controllers/attendance-period.controller");
const attendance_period_service_1 = require("./services/attendance-period.service");
const attendance_period_scheduler_1 = require("./services/attendance-period.scheduler");
const attendance_period_repository_1 = require("./repositories/attendance-period.repository");
const database_module_1 = require("../../database/database.module");
let AttendancePeriodModule = class AttendancePeriodModule {
};
exports.AttendancePeriodModule = AttendancePeriodModule;
exports.AttendancePeriodModule = AttendancePeriodModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [attendance_period_controller_1.AttendancePeriodController],
        providers: [attendance_period_service_1.AttendancePeriodService, attendance_period_scheduler_1.AttendancePeriodScheduler, attendance_period_repository_1.AttendancePeriodRepository],
        exports: [attendance_period_service_1.AttendancePeriodService, attendance_period_repository_1.AttendancePeriodRepository],
    })
], AttendancePeriodModule);
//# sourceMappingURL=attendance-period.module.js.map