import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AttendanceEvent } from '../services/kafka.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  role?: string;
  department?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedClients = new Map<string, AuthenticatedSocket>();

  constructor(private jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('🚀 Notification WebSocket Gateway initialized');
  }

  async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    try {
      // Extract token from handshake auth or query
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      
      if (!token) {
        this.logger.warn(`❌ Client ${client.id} connected without auth token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token.replace('Bearer ', ''));
      client.userId = payload.sub;
      client.role = payload.role;
      client.department = payload.department;

      this.connectedClients.set(client.id, client);
      
      this.logger.log(`✅ Client ${client.id} connected - User: ${client.userId}, Role: ${client.role}`);
      
      // Join room based on role
      if (client.role === 'SUPER' || client.role === 'HR') {
        await client.join('admin-room');
        this.logger.log(`👑 Admin ${client.userId} joined admin-room`);
      } else {
        await client.join(`department-${client.department}`);
        this.logger.log(`🏢 User ${client.userId} joined department-${client.department}`);
      }

      // Send connection confirmation
      client.emit('connected', {
        message: 'Successfully connected to notifications',
        userId: client.userId,
        role: client.role,
      });

    } catch (error) {
      this.logger.error(`❌ Authentication failed for client ${client.id}:`, error.message);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`👋 Client ${client.id} disconnected`);
  }

  // Send attendance notification to appropriate users
  async sendAttendanceNotification(event: AttendanceEvent) {
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

      // Send to admin room (SUPER and HR users)
      this.server.to('admin-room').emit('attendance-notification', notification);

      // Send to department room if employee's department is known
      if (event.department) {
        this.server.to(`department-${event.department}`).emit('attendance-notification', notification);
      }

      this.logger.log(`📢 Sent notification: ${event.type} for ${event.employeeName}`);
      
      // Log connected clients count
      const adminCount = (await this.server.in('admin-room').fetchSockets()).length;
      const deptCount = event.department 
        ? (await this.server.in(`department-${event.department}`).fetchSockets()).length 
        : 0;
        
      this.logger.log(`📊 Notification sent to ${adminCount} admins, ${deptCount} department users`);

    } catch (error) {
      this.logger.error('❌ Failed to send attendance notification:', error);
    }
  }

  // Manual test notification (for testing purposes)
  @SubscribeMessage('test-notification')
  async handleTestNotification(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: any,
  ) {
    if (client.role !== 'SUPER' && client.role !== 'HR') {
      client.emit('error', { message: 'Unauthorized to send test notifications' });
      return;
    }

    const testEvent: AttendanceEvent = {
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

  // Get room info (for debugging)
  @SubscribeMessage('get-room-info')
  async handleGetRoomInfo(@ConnectedSocket() client: AuthenticatedSocket) {
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

  private getNotificationTitle(event: AttendanceEvent): string {
    const action = event.type === 'CLOCK_IN' ? 'Clocked In' : 'Clocked Out';
    const status = event.isLate ? ' (Late)' : event.isEarlyLeave ? ' (Early)' : '';
    return `${event.employeeName} ${action}${status}`;
  }

  private getNotificationMessage(event: AttendanceEvent): string {
    const time = new Date(event.timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    let message = `${event.employeeName} ${event.type === 'CLOCK_IN' ? 'masuk' : 'pulang'} pada ${time}`;
    
    if (event.isLate) {
      message += ' (Terlambat)';
    } else if (event.isEarlyLeave) {
      message += ' (Pulang Cepat)';
    }
    
    if (event.type === 'CLOCK_OUT' && event.workDuration) {
      const hours = Math.floor(event.workDuration / 60);
      const minutes = event.workDuration % 60;
      message += ` - Durasi kerja: ${hours}j ${minutes}m`;
    }
    
    return message;
  }

  // Send dashboard update to admin clients
  async sendDashboardUpdate(dashboardData: any) {
    try {
      this.logger.log(`📊 Broadcasting dashboard update to admin clients`);
      
      const updateEvent = {
        type: 'dashboard-update',
        data: dashboardData,
        timestamp: new Date().toISOString(),
      };

      // Send to admin room only
      this.server.to('admin-room').emit('dashboard-update', updateEvent);
      this.logger.log(`📊 Dashboard update sent to admin clients`);
      
      return updateEvent;
    } catch (error) {
      this.logger.error(`❌ Error sending dashboard update:`, error);
      throw error;
    }
  }

  // Get statistics for admin dashboard
  async getNotificationStats() {
    const rooms = await this.server.fetchSockets();
    const adminSockets = await this.server.in('admin-room').fetchSockets();
    
    return {
      totalConnected: rooms.length,
      adminConnected: adminSockets.length,
      timestamp: new Date().toISOString(),
    };
  }
}