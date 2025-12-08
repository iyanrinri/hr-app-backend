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
var KafkaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaService = void 0;
const common_1 = require("@nestjs/common");
const kafkajs_1 = require("kafkajs");
let KafkaService = KafkaService_1 = class KafkaService {
    logger = new common_1.Logger(KafkaService_1.name);
    kafka;
    producer;
    consumer;
    connected = false;
    constructor() {
        this.kafka = new kafkajs_1.Kafka({
            clientId: process.env.KAFKA_CLIENT_ID || 'hr-attendance-service',
            brokers: [process.env.KAFKA_BROKER || 'localhost:9093'],
            retry: {
                initialRetryTime: 100,
                retries: 8,
            },
        });
        this.producer = this.kafka.producer({
            maxInFlightRequests: 1,
            idempotent: true,
            transactionTimeout: 30000,
        });
        this.consumer = this.kafka.consumer({
            groupId: process.env.KAFKA_GROUP_ID || 'hr-notification-consumer',
        });
    }
    async onModuleInit() {
        try {
            this.logger.log('🔄 Attempting to connect to Kafka...');
            await Promise.race([
                this.producer.connect(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Kafka connection timeout')), 5000))
            ]);
            await this.consumer.connect();
            this.connected = true;
            this.logger.log('✅ Kafka producer and consumer connected successfully');
            await this.consumer.subscribe({
                topic: 'attendance-events',
                fromBeginning: false,
            });
            this.logger.log('✅ Subscribed to attendance-events topic');
        }
        catch (error) {
            this.connected = false;
            this.logger.warn(`⚠️  Kafka connection failed: ${error.message}`);
            this.logger.warn('📱 Running in WebSocket-only mode (notifications will still work)');
        }
    }
    async onModuleDestroy() {
        try {
            await this.producer.disconnect();
            await this.consumer.disconnect();
            this.logger.log('✅ Kafka connections closed');
        }
        catch (error) {
            this.logger.error('❌ Error closing Kafka connections:', error);
        }
    }
    async sendAttendanceEvent(event) {
        try {
            await this.producer.send({
                topic: 'attendance-events',
                messages: [
                    {
                        key: event.employeeId,
                        value: JSON.stringify(event),
                        timestamp: Date.now().toString(),
                        headers: {
                            eventType: event.type,
                            department: event.department,
                        },
                    },
                ],
            });
            this.logger.log(`📤 Attendance event sent: ${event.type} for employee ${event.employeeName}`);
        }
        catch (error) {
            this.logger.error('❌ Failed to send attendance event:', error);
        }
    }
    async startConsumer(messageHandler) {
        try {
            await this.consumer.run({
                eachMessage: messageHandler,
            });
            this.logger.log('🎧 Kafka consumer started and listening for messages');
        }
        catch (error) {
            this.logger.error('❌ Error starting Kafka consumer:', error);
        }
    }
    async isConnected() {
        return this.connected;
    }
    async createTopics() {
        const admin = this.kafka.admin();
        try {
            await admin.connect();
            const topicsToCreate = [
                {
                    topic: 'attendance-events',
                    numPartitions: 3,
                    replicationFactor: 1,
                },
            ];
            await admin.createTopics({
                topics: topicsToCreate,
                waitForLeaders: true,
            });
            this.logger.log('✅ Kafka topics created successfully');
        }
        catch (error) {
            this.logger.warn('⚠️ Topics may already exist or error creating:', error.message);
        }
        finally {
            await admin.disconnect();
        }
    }
};
exports.KafkaService = KafkaService;
exports.KafkaService = KafkaService = KafkaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], KafkaService);
//# sourceMappingURL=kafka.service.js.map