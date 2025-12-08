import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

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
  workDuration?: number; // in minutes for clock-out
}

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private connected = false;

  constructor() {
    this.kafka = new Kafka({
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
      
      // Test Kafka connection with timeout
      await Promise.race([
        this.producer.connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Kafka connection timeout')), 5000)
        )
      ]);
      
      await this.consumer.connect();
      this.connected = true;
      this.logger.log('✅ Kafka producer and consumer connected successfully');
      
      // Subscribe to attendance events topic
      await this.consumer.subscribe({
        topic: 'attendance-events',
        fromBeginning: false,
      });

      this.logger.log('✅ Subscribed to attendance-events topic');
    } catch (error) {
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
    } catch (error) {
      this.logger.error('❌ Error closing Kafka connections:', error);
    }
  }

  // Producer: Send attendance events
  async sendAttendanceEvent(event: AttendanceEvent): Promise<void> {
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
    } catch (error) {
      this.logger.error('❌ Failed to send attendance event:', error);
      // Don't throw error to avoid blocking attendance process
    }
  }

  // Consumer: Process attendance events
  async startConsumer(messageHandler: (payload: EachMessagePayload) => Promise<void>) {
    try {
      await this.consumer.run({
        eachMessage: messageHandler,
      });
      this.logger.log('🎧 Kafka consumer started and listening for messages');
    } catch (error) {
      this.logger.error('❌ Error starting Kafka consumer:', error);
    }
  }

  // Utility method to check Kafka connection
  async isConnected(): Promise<boolean> {
    return this.connected;
  }

  // Create topics if they don't exist (for development)
  async createTopics(): Promise<void> {
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
    } catch (error) {
      this.logger.warn('⚠️ Topics may already exist or error creating:', error.message);
    } finally {
      await admin.disconnect();
    }
  }
}