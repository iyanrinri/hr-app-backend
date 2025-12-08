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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const kafka_service_1 = require("../services/kafka.service");
const notification_gateway_1 = require("../gateways/notification.gateway");
let NotificationService = NotificationService_1 = class NotificationService {
    kafkaService;
    notificationGateway;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(kafkaService, notificationGateway) {
        this.kafkaService = kafkaService;
        this.notificationGateway = notificationGateway;
    }
    async onModuleInit() {
        await this.startAttendanceEventConsumer();
    }
    async startAttendanceEventConsumer() {
        try {
            await this.kafkaService.startConsumer(async (payload) => {
                await this.handleAttendanceEvent(payload);
            });
            this.logger.log('🎧 Started listening for attendance events from Kafka');
        }
        catch (error) {
            this.logger.error('❌ Failed to start attendance event consumer:', error);
        }
    }
    async handleAttendanceEvent(payload) {
        try {
            const eventData = JSON.parse(payload.message.value?.toString() || '{}');
            this.logger.log(`📨 Received attendance event: ${eventData.type} for ${eventData.employeeName}`);
            await this.notificationGateway.sendAttendanceNotification(eventData);
            if (eventData.isLate && eventData.type === 'CLOCK_IN') {
                this.logger.warn(`⚠️ Late arrival detected: ${eventData.employeeName} from ${eventData.department}`);
            }
        }
        catch (error) {
            this.logger.error('❌ Error handling attendance event:', error);
        }
    }
    async sendAttendanceNotification(event) {
        try {
            await this.kafkaService.sendAttendanceEvent(event);
            this.logger.log(`✅ Attendance notification queued for ${event.employeeName}`);
        }
        catch (error) {
            this.logger.error('❌ Failed to queue attendance notification:', error);
            await this.notificationGateway.sendAttendanceNotification(event);
        }
    }
    async getServiceHealth() {
        const kafkaConnected = await this.kafkaService.isConnected();
        const stats = await this.notificationGateway.getNotificationStats();
        return {
            kafka: {
                connected: kafkaConnected,
                status: kafkaConnected ? 'healthy' : 'disconnected',
            },
            websocket: {
                connected: stats.totalConnected,
                adminConnected: stats.adminConnected,
                status: 'healthy',
            },
            timestamp: new Date().toISOString(),
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [kafka_service_1.KafkaService,
        notification_gateway_1.NotificationGateway])
], NotificationService);
//# sourceMappingURL=notification.service.js.map