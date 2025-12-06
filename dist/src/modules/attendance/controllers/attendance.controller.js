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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attendance_service_1 = require("../services/attendance.service");
const clock_in_dto_1 = require("../dto/clock-in.dto");
const clock_out_dto_1 = require("../dto/clock-out.dto");
const attendance_history_dto_1 = require("../dto/attendance-history.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async clockIn(clockInDto, req, ip, userAgent) {
        const employeeId = BigInt(req.user.sub);
        return this.attendanceService.clockIn(employeeId, clockInDto, ip, userAgent);
    }
    async clockOut(clockOutDto, req, ip, userAgent) {
        const employeeId = BigInt(req.user.sub);
        return this.attendanceService.clockOut(employeeId, clockOutDto, ip, userAgent);
    }
    async getTodayAttendance(req) {
        const employeeId = BigInt(req.user.sub);
        return this.attendanceService.getTodayAttendance(employeeId);
    }
    async getAttendanceHistory(query, req) {
        const userRole = req.user.role;
        const userId = req.user.sub;
        return this.attendanceService.getAttendanceHistory(query, userRole, userId);
    }
    async getAttendanceLogs(employeeId, date) {
        return this.attendanceService.getAttendanceLogs(employeeId ? BigInt(employeeId) : undefined, date);
    }
    async getAttendanceStats(startDate, endDate, req, employeeId) {
        let targetEmployeeId;
        const currentUserId = BigInt(req.user.sub);
        const userRole = req.user.role;
        if (employeeId) {
            if (userRole !== client_1.Role.SUPER && userRole !== client_1.Role.HR) {
                throw new common_1.ForbiddenException('Access denied. Only SUPER and HR users can query other employee statistics.');
            }
            targetEmployeeId = BigInt(employeeId);
        }
        else {
            targetEmployeeId = currentUserId;
        }
        return this.attendanceService.getAttendanceStats(targetEmployeeId, startDate, endDate);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('clock-in'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Clock in to start work' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully clocked in.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - already clocked in or weekend/holiday.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clock_in_dto_1.ClockInDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Post)('clock-out'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Clock out to end work' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully clocked out.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - not clocked in or weekend/holiday.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clock_out_dto_1.ClockOutDto, Object, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "clockOut", null);
__decorate([
    (0, common_1.Get)('today'),
    (0, swagger_1.ApiOperation)({ summary: 'Get today\'s attendance status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Today\'s attendance data.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getTodayAttendance", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance history data.' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [attendance_history_dto_1.AttendanceHistoryDto, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceHistory", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance logs data.' }),
    __param(0, (0, common_1.Query)('employeeId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceLogs", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get attendance statistics',
        description: 'Get attendance statistics for the authenticated user. Only SUPER/HR users can query other employees by providing employeeId parameter.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: true,
        description: 'Start date for statistics (YYYY-MM-DD)',
        example: '2025-12-01'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: true,
        description: 'End date for statistics (YYYY-MM-DD)',
        example: '2025-12-31'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'employeeId',
        required: false,
        description: 'Employee ID to query (only available for SUPER/HR users). If not provided, returns current user stats.',
        example: '1'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance statistics data.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - insufficient permissions to query other employee data.' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getAttendanceStats", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('attendance'),
    (0, swagger_1.ApiSecurity)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('attendance'),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map