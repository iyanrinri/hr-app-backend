"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LeaveEmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveEmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let LeaveEmailService = LeaveEmailService_1 = class LeaveEmailService {
    logger = new common_1.Logger(LeaveEmailService_1.name);
    transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER || 'hr-system@company.com',
                pass: process.env.GMAIL_APP_PASSWORD || 'dummy-password',
            },
        });
    }
    async sendLeaveRequestToManager(managerEmail, managerName, leaveData) {
        try {
            const mailOptions = {
                from: process.env.GMAIL_USER || 'hr-system@company.com',
                to: managerEmail,
                subject: `Leave Request - ${leaveData.employeeName} (${leaveData.leaveType})`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Leave Request Approval Required</h2>
            
            <p>Dear ${managerName},</p>
            
            <p>A new leave request has been submitted by <strong>${leaveData.employeeName}</strong> and requires your approval.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Leave Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Employee:</strong> ${leaveData.employeeName}</li>
                <li><strong>Leave Type:</strong> ${leaveData.leaveType}</li>
                <li><strong>Start Date:</strong> ${leaveData.startDate}</li>
                <li><strong>End Date:</strong> ${leaveData.endDate}</li>
                <li><strong>Total Days:</strong> ${leaveData.totalDays} day(s)</li>
                <li><strong>Reason:</strong> ${leaveData.reason}</li>
                ${leaveData.emergencyContact ? `<li><strong>Emergency Contact:</strong> ${leaveData.emergencyContact}</li>` : ''}
                ${leaveData.handoverNotes ? `<li><strong>Handover Notes:</strong> ${leaveData.handoverNotes}</li>` : ''}
              </ul>
            </div>
            
            <p>Please review and approve/reject this request through the HR system.</p>
            
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #dee2e6;">
              <p style="font-size: 12px; color: #6c757d;">
                This is an automated email from the HR Management System.
              </p>
            </div>
          </div>
        `,
            };
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Leave request email sent to manager: ${managerEmail}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to manager: ${error.message}`);
        }
    }
    async sendLeaveRequestToHR(hrEmail, leaveData) {
        try {
            const mailOptions = {
                from: process.env.GMAIL_USER || 'hr-system@company.com',
                to: hrEmail,
                subject: `Leave Request - ${leaveData.employeeName} (${leaveData.leaveType})`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Leave Request Submitted</h2>
            
            <p>Dear HR Team,</p>
            
            <p>A new leave request has been submitted by <strong>${leaveData.employeeName}</strong>.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Leave Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Employee:</strong> ${leaveData.employeeName}</li>
                <li><strong>Leave Type:</strong> ${leaveData.leaveType}</li>
                <li><strong>Start Date:</strong> ${leaveData.startDate}</li>
                <li><strong>End Date:</strong> ${leaveData.endDate}</li>
                <li><strong>Total Days:</strong> ${leaveData.totalDays} day(s)</li>
                <li><strong>Reason:</strong> ${leaveData.reason}</li>
                ${leaveData.emergencyContact ? `<li><strong>Emergency Contact:</strong> ${leaveData.emergencyContact}</li>` : ''}
                ${leaveData.handoverNotes ? `<li><strong>Handover Notes:</strong> ${leaveData.handoverNotes}</li>` : ''}
              </ul>
            </div>
            
            <p>Please review this request in the HR system.</p>
            
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #dee2e6;">
              <p style="font-size: 12px; color: #6c757d;">
                This is an automated email from the HR Management System.
              </p>
            </div>
          </div>
        `,
            };
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Leave request email sent to HR: ${hrEmail}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to HR: ${error.message}`);
        }
    }
    async sendLeaveApprovalNotification(employeeEmail, employeeName, approverName, approverType, leaveData, isApproved, comments) {
        try {
            const status = isApproved ? 'Approved' : 'Rejected';
            const statusColor = isApproved ? '#28a745' : '#dc3545';
            const mailOptions = {
                from: process.env.GMAIL_USER || 'hr-system@company.com',
                to: employeeEmail,
                subject: `Leave Request ${status} - ${leaveData.leaveType}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: ${statusColor};">Leave Request ${status}</h2>
            
            <p>Dear ${employeeName},</p>
            
            <p>Your leave request has been <strong style="color: ${statusColor};">${status.toLowerCase()}</strong> by ${approverName} (${approverType}).</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Leave Details:</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Leave Type:</strong> ${leaveData.leaveType}</li>
                <li><strong>Start Date:</strong> ${leaveData.startDate}</li>
                <li><strong>End Date:</strong> ${leaveData.endDate}</li>
                <li><strong>Total Days:</strong> ${leaveData.totalDays} day(s)</li>
                <li><strong>Status:</strong> <span style="color: ${statusColor};">${status}</span></li>
                ${comments ? `<li><strong>Comments:</strong> ${comments}</li>` : ''}
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #dee2e6;">
              <p style="font-size: 12px; color: #6c757d;">
                This is an automated email from the HR Management System.
              </p>
            </div>
          </div>
        `,
            };
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Leave ${status.toLowerCase()} notification sent to employee: ${employeeEmail}`);
        }
        catch (error) {
            this.logger.error(`Failed to send leave ${status.toLowerCase()} email: ${error.message}`);
        }
    }
    async notifyLeaveSubmission(leaveRequest, managerEmail, hrEmail) {
        const leaveData = {
            employeeName: `${leaveRequest.employee.firstName} ${leaveRequest.employee.lastName}`,
            leaveType: leaveRequest.leaveTypeConfig.name,
            startDate: leaveRequest.startDate.toISOString().split('T')[0],
            endDate: leaveRequest.endDate.toISOString().split('T')[0],
            totalDays: leaveRequest.totalDays,
            reason: leaveRequest.reason,
            emergencyContact: leaveRequest.emergencyContact,
            handoverNotes: leaveRequest.handoverNotes,
        };
        if (managerEmail) {
            await this.sendLeaveRequestToManager(managerEmail, 'Manager', leaveData);
        }
        if (hrEmail) {
            await this.sendLeaveRequestToHR(hrEmail, leaveData);
        }
    }
    async notifyLeaveApproval(leaveRequest, approver, isApproved, comments) {
        const employeeEmail = leaveRequest.employee.email;
        if (!employeeEmail)
            return;
        const leaveData = {
            employeeName: `${leaveRequest.employee.firstName} ${leaveRequest.employee.lastName}`,
            leaveType: leaveRequest.leaveTypeConfig.name,
            startDate: leaveRequest.startDate.toISOString().split('T')[0],
            endDate: leaveRequest.endDate.toISOString().split('T')[0],
            totalDays: leaveRequest.totalDays,
            reason: leaveRequest.reason,
        };
        await this.sendLeaveApprovalNotification(employeeEmail, leaveData.employeeName, `${approver.firstName} ${approver.lastName}`, approver.position || 'Manager', leaveData, isApproved, comments);
    }
};
exports.LeaveEmailService = LeaveEmailService;
exports.LeaveEmailService = LeaveEmailService = LeaveEmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LeaveEmailService);
//# sourceMappingURL=leave-email.service.js.map