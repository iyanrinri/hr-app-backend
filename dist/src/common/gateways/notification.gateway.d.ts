import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { AttendanceEvent } from '../services/kafka.service';
interface AuthenticatedSocket extends Socket {
    userId?: string;
    role?: string;
    department?: string;
}
export declare class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    private readonly logger;
    private connectedClients;
    constructor(jwtService: JwtService);
    afterInit(server: Server): void;
    handleConnection(client: AuthenticatedSocket, ...args: any[]): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): void;
    sendAttendanceNotification(event: AttendanceEvent): Promise<void>;
    handleTestNotification(client: AuthenticatedSocket, data: any): Promise<void>;
    handleGetRoomInfo(client: AuthenticatedSocket): Promise<void>;
    private getNotificationTitle;
    private getNotificationMessage;
    sendDashboardUpdate(dashboardData: any): Promise<{
        type: string;
        data: any;
        timestamp: string;
    }>;
    getNotificationStats(): Promise<{
        totalConnected: number;
        adminConnected: number;
        timestamp: string;
    }>;
}
export {};
