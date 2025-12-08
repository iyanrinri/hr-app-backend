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
var NotificationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let NotificationGateway = NotificationGateway_1 = class NotificationGateway {
    jwtService;
    server;
    logger = new common_1.Logger(NotificationGateway_1.name);
    connectedClients = new Map();
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    afterInit(server) {
        this.logger.log('🚀 Notification WebSocket Gateway initialized');
    }
    async handleConnection(client, ...args) {
        try {
            const token = client.handshake.auth?.token || client.handshake.query?.token;
            if (!token) {
                this.logger.warn(`❌ Client ${client.id} connected without auth token`);
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token.replace('Bearer ', ''));
            client.userId = payload.sub;
            client.role = payload.role;
            client.department = payload.department;
            this.connectedClients.set(client.id, client);
            this.logger.log(`✅ Client ${client.id} connected - User: ${client.userId}, Role: ${client.role}`);
            if (client.role === 'SUPER' || client.role === 'HR') {
                await client.join('admin-room');
                this.logger.log(`👑 Admin ${client.userId} joined admin-room`);
            }
            else {
                await client.join(`department-${client.department}`);
                this.logger.log(`🏢 User ${client.userId} joined department-${client.department}`);
            }
            client.emit('connected', {
                message: 'Successfully connected to notifications',
                userId: client.userId,
                role: client.role,
            });
        }
        catch (error) {
            this.logger.error(`❌ Authentication failed for client ${client.id}:`, error.message);
            client.emit('error', { message: 'Authentication failed' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.connectedClients.delete(client.id);
        this.logger.log(`👋 Client ${client.id} disconnected`);
    }
    async sendAttendanceNotification(event) {
        try {
            const notification = {
                id: `attendance_${Date.now()}`,
                type: 'ATTENDANCE',
                title: this.getNotificationTitle(event),
                message: this.getNotificationMessage(event),
                data: event,
                timestamp: new Date().toISOString(),
                priority: event.isLate ? 'high' : 'normal',
            };
            this.server.to('admin-room').emit('attendance-notification', notification);
            if (event.department) {
                this.server.to(`department-${event.department}`).emit('attendance-notification', notification);
            }
            this.logger.log(`📢 Sent notification: ${event.type} for ${event.employeeName}`);
            const adminCount = (await this.server.in('admin-room').fetchSockets()).length;
            const deptCount = event.department
                ? (await this.server.in(`department-${event.department}`).fetchSockets()).length
                : 0;
            this.logger.log(`📊 Notification sent to ${adminCount} admins, ${deptCount} department users`);
        }
        catch (error) {
            this.logger.error('❌ Failed to send attendance notification:', error);
        }
    }
    async handleTestNotification(client, data) {
        if (client.role !== 'SUPER' && client.role !== 'HR') {
            client.emit('error', { message: 'Unauthorized to send test notifications' });
            return;
        }
        const testEvent = {
            type: 'CLOCK_IN',
            employeeId: '999',
            employeeName: 'Test User',
            department: 'IT',
            timestamp: new Date().toISOString(),
            isLate: false,
        };
        await this.sendAttendanceNotification(testEvent);
        client.emit('test-sent', { message: 'Test notification sent' });
    }
    async handleGetRoomInfo(client) {
        if (client.role !== 'SUPER') {
            client.emit('error', { message: 'Unauthorized' });
            return;
        }
        const adminSockets = await this.server.in('admin-room').fetchSockets();
        const rooms = await this.server.fetchSockets();
        client.emit('room-info', {
            totalConnected: rooms.length,
            adminConnected: adminSockets.length,
            connectedClients: Array.from(this.connectedClients.values()).map(c => ({
                id: c.id,
                userId: c.userId,
                role: c.role,
                department: c.department,
            })),
        });
    }
    getNotificationTitle(event) {
        const action = event.type === 'CLOCK_IN' ? 'Clocked In' : 'Clocked Out';
        const status = event.isLate ? ' (Late)' : event.isEarlyLeave ? ' (Early)' : '';
        return `${event.employeeName} ${action}${status}`;
    }
    getNotificationMessage(event) {
        const time = new Date(event.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
        let message = `${event.employeeName} ${event.type === 'CLOCK_IN' ? 'masuk' : 'pulang'} pada ${time}`;
        if (event.isLate) {
            message += ' (Terlambat)';
        }
        else if (event.isEarlyLeave) {
            message += ' (Pulang Cepat)';
        }
        if (event.type === 'CLOCK_OUT' && event.workDuration) {
            const hours = Math.floor(event.workDuration / 60);
            const minutes = event.workDuration % 60;
            message += ` - Durasi kerja: ${hours}j ${minutes}m`;
        }
        return message;
    }
    async sendDashboardUpdate(dashboardData) {
        try {
            this.logger.log(`📊 Broadcasting dashboard update to admin clients`);
            const updateEvent = {
                type: 'dashboard-update',
                data: dashboardData,
                timestamp: new Date().toISOString(),
            };
            this.server.to('admin-room').emit('dashboard-update', updateEvent);
            this.logger.log(`📊 Dashboard update sent to admin clients`);
            return updateEvent;
        }
        catch (error) {
            this.logger.error(`❌ Error sending dashboard update:`, error);
            throw error;
        }
    }
    async getNotificationStats() {
        const rooms = await this.server.fetchSockets();
        const adminSockets = await this.server.in('admin-room').fetchSockets();
        return {
            totalConnected: rooms.length,
            adminConnected: adminSockets.length,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('test-notification'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleTestNotification", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get-room-info'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleGetRoomInfo", null);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || ['http://localhost:3001', 'http://localhost:3000'],
            credentials: true,
        },
        namespace: '/notifications',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map