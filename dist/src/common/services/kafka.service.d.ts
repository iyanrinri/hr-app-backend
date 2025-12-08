import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
export interface AttendanceEvent {
    type: 'CLOCK_IN' | 'CLOCK_OUT';
    employeeId: string;
    employeeName: string;
    department: string;
    timestamp: string;
    location?: {
        latitude?: number;
        longitude?: number;
        address?: string;
    };
    isLate?: boolean;
    isEarlyLeave?: boolean;
    workDuration?: number;
}
export declare class KafkaService implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private kafka;
    private producer;
    private consumer;
    private connected;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    sendAttendanceEvent(event: AttendanceEvent): Promise<void>;
    startConsumer(messageHandler: (payload: EachMessagePayload) => Promise<void>): Promise<void>;
    isConnected(): Promise<boolean>;
    createTopics(): Promise<void>;
}
