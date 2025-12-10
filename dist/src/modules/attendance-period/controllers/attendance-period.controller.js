"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendancePeriodController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attendance_period_service_1 = require("../services/attendance-period.service");
const attendance_period_scheduler_1 = require("../services/attendance-period.scheduler");
const create_attendance_period_dto_1 = require("../dto/create-attendance-period.dto");
const update_attendance_period_dto_1 = require("../dto/update-attendance-period.dto");
const create_holiday_dto_1 = require("../dto/create-holiday.dto");
const find_all_periods_dto_1 = require("../dto/find-all-periods.dto");
const period_response_dto_1 = require("../dto/period-response.dto");
const scheduler_response_dto_1 = require("../dto/scheduler-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AttendancePeriodController = class AttendancePeriodController {
    attendancePeriodService;
    attendancePeriodScheduler;
    constructor(attendancePeriodService, attendancePeriodScheduler) {
        this.attendancePeriodService = attendancePeriodService;
        this.attendancePeriodScheduler = attendancePeriodScheduler;
    }
    create(createDto, req) {
        return this.attendancePeriodService.create(createDto, req.user.sub);
    }
    findAll(query) {
        return this.attendancePeriodService.findAll(query);
    }
    getActivePeriod() {
        return this.attendancePeriodService.getActivePeriod();
    }
    findOne(id) {
        return this.attendancePeriodService.findOne(BigInt(id));
    }
    update(id, updateDto) {
        return this.attendancePeriodService.update(BigInt(id), updateDto);
    }
    remove(id) {
        return this.attendancePeriodService.remove(BigInt(id));
    }
    createHoliday(createDto) {
        return this.attendancePeriodService.createHoliday(createDto);
    }
    findHolidays(attendancePeriodId) {
        return this.attendancePeriodService.findHolidays(attendancePeriodId ? BigInt(attendancePeriodId) : undefined);
    }
    updateHoliday(id, updateData) {
        return this.attendancePeriodService.updateHoliday(BigInt(id), updateData);
    }
    deleteHoliday(id) {
        return this.attendancePeriodService.deleteHoliday(BigInt(id));
    }
    async runPeriodsCheck() {
        await this.attendancePeriodScheduler.runPeriodsCheck();
        return {
            status: 'success',
            message: 'Period status check completed',
            timestamp: new Date(),
        };
    }
    async getSchedulerStats() {
        const stats = await this.attendancePeriodScheduler.getPeriodStatusStats();
        return {
            status: 'success',
            data: stats,
        };
    }
};
exports.AttendancePeriodController = AttendancePeriodController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create attendance period (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attendance period created successfully.', type: period_response_dto_1.AttendancePeriodResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attendance_period_dto_1.CreateAttendancePeriodDto, Object]),
    __metadata("design:returntype", void 0)
], AttendancePeriodController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all attendance periods (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of attendance periods.', type: [period_response_dto_1.AttendancePeriodResponseDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_all_periods_dto_1.FindAllPeriodsDto]),
    __metadata("design:returntype", void 0)
], AttendancePeriodController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current active attendance period (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current active attendance period.', type: period_response_dto_1.AttendancePeriodResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AttendancePeriodController.prototype, "getActivePeriod", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance period by ID (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attendance period ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance period details.', type: period_response_dto_1.AttendancePeriodResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AttendancePeriodController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update attendance period (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attendance period ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance period updated successfully.', type: period_response_dto_1.AttendancePeriodResponseDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_attendance_period_dto_1.UpdateAttendancePeriodDto]),
    __metadata("design:returntype", void 0)
], AttendancePeriodController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete attendance period (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Attendance period ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance period deleted successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AttendancePeriodController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('holidays'),
    (0, swagger_1.ApiOperation)({ summary: 'Create holiday (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Holiday created successfully.', type: period_response_dto_1.HolidayResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_holiday_dto_1.CreateHolidayDto]),
    __metadata("design:returntype", void 0)
], AttendancePeriodController.prototype, "createHoliday", null);
__decorate([
    (0, common_1.Get)('holidays/list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get holidays (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of holidays.', type: [period_response_dto_1.HolidayResponseDto] }),
    __param(0, (0, common_1.Query)('attendancePeriodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AttendancePeriodController.prototype, "findHolidays", null);
__decorate([
    (0, common_1.Patch)('holidays/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update holiday (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Holiday ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Holiday updated successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AttendancePeriodController.prototype, "updateHoliday", null);
__decorate([
    (0, common_1.Delete)('holidays/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete holiday (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Holiday ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Holiday deleted successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AttendancePeriodController.prototype, "deleteHoliday", null);
__decorate([
    (0, common_1.Post)('scheduler/run-check'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually run period status check (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Period check completed successfully.',
        type: scheduler_response_dto_1.SchedulerRunResponseDto
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendancePeriodController.prototype, "runPeriodsCheck", null);
__decorate([
    (0, common_1.Get)('scheduler/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get period scheduler statistics (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Period scheduler statistics.',
        type: scheduler_response_dto_1.SchedulerStatsWrapperDto
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendancePeriodController.prototype, "getSchedulerStats", null);
exports.AttendancePeriodController = AttendancePeriodController = __decorate([
    (0, swagger_1.ApiTags)('attendance-periods'),
    (0, common_1.Controller)('attendance-periods'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [attendance_period_service_1.AttendancePeriodService,
        attendance_period_scheduler_1.AttendancePeriodScheduler])
], AttendancePeriodController);
//# sourceMappingURL=attendance-period.controller.js.map