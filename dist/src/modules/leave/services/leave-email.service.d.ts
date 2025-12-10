interface LeaveNotificationData {
    employeeName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    emergencyContact?: string;
    handoverNotes?: string;
}
export declare class LeaveEmailService {
    private readonly logger;
    private transporter;
    constructor();
    sendLeaveRequestToManager(managerEmail: string, managerName: string, leaveData: LeaveNotificationData): Promise<void>;
    sendLeaveRequestToHR(hrEmail: string, leaveData: LeaveNotificationData): Promise<void>;
    sendLeaveApprovalNotification(employeeEmail: string, employeeName: string, approverName: string, approverType: string, leaveData: LeaveNotificationData, isApproved: boolean, comments?: string): Promise<void>;
    notifyLeaveSubmission(leaveRequest: any, managerEmail?: string, hrEmail?: string): Promise<void>;
    notifyLeaveApproval(leaveRequest: any, approver: any, isApproved: boolean, comments?: string): Promise<void>;
}
export {};
