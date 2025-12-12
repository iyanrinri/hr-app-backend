// Temporary fix to bypass build errors - this is for development only
// These should be properly implemented when the database is migrated

// Export simplified overtime status for compatibility
export enum OvertimeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED', 
  REJECTED = 'REJECTED'
}

// Export simplified overtime method
export const getOvertimeSettings = () => ({
  maxHoursPerDay: 4,
  maxHoursPerWeek: 20, 
  maxHoursPerMonth: 80,
  weekdayRate: 1.5,
  weekendRate: 2.0,
  holidayRate: 3.0,
  requiresApproval: true,
  managerApprovalRequired: true,
  hrApprovalRequired: true,
});