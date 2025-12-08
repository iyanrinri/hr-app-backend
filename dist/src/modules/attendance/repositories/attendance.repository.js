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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let AttendanceRepository = class AttendanceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findTodayAttendance(employeeId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return this.prisma.attendance.findFirst({
            where: {
                employeeId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                attendancePeriod: true,
                employee: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async createAttendance(data) {
        return this.prisma.attendance.create({
            data,
            include: {
                attendancePeriod: true,
                employee: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async updateAttendance(params) {
        return this.prisma.attendance.update({
            ...params,
            include: {
                attendancePeriod: true,
                employee: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async createAttendanceLog(data) {
        return this.prisma.attendanceLog.create({
            data,
        });
    }
    async findAttendanceHistory(params) {
        return this.prisma.attendance.findMany({
            ...params,
            include: {
                attendancePeriod: {
                    select: {
                        id: true,
                        name: true,
                        startDate: true,
                        endDate: true,
                    },
                },
                employee: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async countAttendance(where) {
        return this.prisma.attendance.count({ where });
    }
    async findAttendanceLogs(params) {
        return this.prisma.attendanceLog.findMany({
            ...params,
            include: {
                employee: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
                attendancePeriod: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async getLatestLog(employeeId, date, type) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return this.prisma.attendanceLog.findFirst({
            where: {
                employeeId,
                timestamp: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                ...(type && { type }),
            },
            orderBy: {
                timestamp: 'desc',
            },
        });
    }
    async findAttendanceWithLogs(attendanceId) {
        return this.prisma.attendance.findUnique({
            where: { id: attendanceId },
            include: {
                attendancePeriod: true,
                employee: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getAttendanceStats(employeeId, startDate, endDate) {
        const stats = await this.prisma.attendance.groupBy({
            by: ['status'],
            where: {
                employeeId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _count: {
                status: true,
            },
        });
        const totalWorkDuration = await this.prisma.attendance.aggregate({
            where: {
                employeeId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
                workDuration: {
                    not: null,
                },
            },
            _sum: {
                workDuration: true,
            },
        });
        return {
            statusCounts: stats.reduce((acc, curr) => {
                acc[curr.status] = curr._count.status;
                return acc;
            }, {}),
            totalWorkDuration: totalWorkDuration._sum.workDuration || 0,
        };
    }
    async findEmployeeById(employeeId) {
        return this.prisma.employee.findUnique({
            where: { id: employeeId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                department: true,
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });
    }
    async getDashboardData(date, attendancePeriodId) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const allEmployees = await this.prisma.employee.findMany({
            where: {
                isDeleted: false,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        const todayAttendances = await this.prisma.attendance.findMany({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                attendancePeriodId,
            },
            include: {
                employee: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true,
                            },
                        },
                    },
                },
                attendancePeriod: true,
            },
        });
        const attendancePeriod = await this.prisma.attendancePeriod.findUnique({
            where: { id: attendancePeriodId },
        });
        return {
            allEmployees,
            todayAttendances,
            attendancePeriod,
        };
    }
    async getEmployeeAttendanceToday(employeeId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return this.prisma.attendance.findFirst({
            where: {
                employeeId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                employee: true,
                attendancePeriod: true,
            },
        });
    }
};
exports.AttendanceRepository = AttendanceRepository;
exports.AttendanceRepository = AttendanceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceRepository);
//# sourceMappingURL=attendance.repository.js.map