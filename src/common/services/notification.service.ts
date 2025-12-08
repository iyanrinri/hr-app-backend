import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';
import { KafkaService, AttendanceEvent } from '../services/kafka.service';
import { NotificationGateway } from '../gateways/notification.gateway';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private kafkaService: KafkaService,
    private notificationGateway: NotificationGateway,
  ) {}

  async onModuleInit() {
    // Start Kafka consumer to listen for attendance events
    await this.startAttendanceEventConsumer();
  }

  private async startAttendanceEventConsumer() {
    try {
      await this.kafkaService.startConsumer(async (payload: EachMessagePayload) => {
        await this.handleAttendanceEvent(payload);
      });
      
      this.logger.log('🎧 Started listening for attendance events from Kafka');
    } catch (error) {
      this.logger.error('❌ Failed to start attendance event consumer:', error);
    }
  }

  private async handleAttendanceEvent(payload: EachMessagePayload) {
    try {
      const eventData: AttendanceEvent = JSON.parse(payload.message.value?.toString() || '{}');
      
      this.logger.log(`📨 Received attendance event: ${eventData.type} for ${eventData.employeeName}`);

      // Send real-time notification via WebSocket
      await this.notificationGateway.sendAttendanceNotification(eventData);

      // Here you can add more notification channels:
      // - Send push notification via Firebase
      // - Send email notification for specific conditions
      // - Store notification in database for notification history
      // - Send SMS for critical alerts

      // Example: Log late arrivals for further action
      if (eventData.isLate && eventData.type === 'CLOCK_IN') {
        this.logger.warn(`⚠️ Late arrival detected: ${eventData.employeeName} from ${eventData.department}`);
        // Could trigger additional actions like:
        // - Email to HR
        // - Update late arrival counter
        // - Generate report
      }

    } catch (error) {
      this.logger.error('❌ Error handling attendance event:', error);
    }
  }

  // Method to send attendance notification (called by attendance service)
  async sendAttendanceNotification(event: AttendanceEvent) {
    try {
      await this.kafkaService.sendAttendanceEvent(event);
      console.log("BACKEND: Sending attendance notification via Kafka");
      this.logger.log(`BACKEND: Attendance notification queued for ${event.employeeName}`);
    } catch (error) {
      this.logger.error('❌ Failed to queue attendance notification:', error);
      // Fallback: send directly via WebSocket if Kafka fails
      await this.notificationGateway.sendAttendanceNotification(event);
    }
  }

  // Health check method
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
}