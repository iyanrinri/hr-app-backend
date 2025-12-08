import { OnModuleInit } from '@nestjs/common';
import { KafkaService, AttendanceEvent } from '../services/kafka.service';
import { NotificationGateway } from '../gateways/notification.gateway';
export declare class NotificationService implements OnModuleInit {
    private kafkaService;
    private notificationGateway;
    private readonly logger;
    constructor(kafkaService: KafkaService, notificationGateway: NotificationGateway);
    onModuleInit(): Promise<void>;
    private startAttendanceEventConsumer;
    private handleAttendanceEvent;
    sendAttendanceNotification(event: AttendanceEvent): Promise<void>;
    getServiceHealth(): Promise<{
        kafka: {
            connected: boolean;
            status: string;
        };
        websocket: {
            connected: number;
            adminConnected: number;
            status: string;
        };
        timestamp: string;
    }>;
}
