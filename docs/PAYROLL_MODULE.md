# Payroll Module Documentation

## Overview

The Payroll Module provides comprehensive payroll management functionality with automatic overtime pay calculation based on approved overtime requests. It integrates with the salary, overtime, attendance, and settings modules to provide accurate payroll processing.

## Features

### Core Functionality
- **Automatic Payroll Calculation**: Calculates payroll based on current salary and approved overtime requests
- **Overtime Integration**: Automatically calculates overtime pay using configurable rate multipliers
- **Period Management**: Prevents overlapping payroll periods for the same employee
- **Approval Workflow**: Supports processed and paid status tracking
- **Role-based Access**: Different access levels for SUPER/HR/MANAGER/EMPLOYEE roles

### Overtime Calculation
- **Rate Multipliers**: 
  - Weekdays: 1.5x hourly rate
  - Weekends: 2.0x hourly rate  
  - Holidays: 3.0x hourly rate
- **Hourly Rate Calculation**: Monthly salary ÷ 173.33 standard monthly hours
- **Approval Integration**: Only includes APPROVED overtime requests

## Database Schema

### Payroll Model
```prisma
model Payroll {
  id                BigInt   @id @default(autoincrement())
  employeeId        BigInt
  periodStart       DateTime
  periodEnd         DateTime
  baseSalary        Decimal
  overtimePay       Decimal  @default(0)
  deductions        Decimal  @default(0)
  bonuses           Decimal  @default(0)
  grossSalary       Decimal
  netSalary         Decimal
  overtimeHours     Decimal  @default(0)
  regularHours      Decimal  @default(0)
  isPaid            Boolean  @default(false)
  processedAt       DateTime?
  processedBy       BigInt?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  employee          Employee @relation(fields: [employeeId], references: [id])
  processor         User?    @relation(fields: [processedBy], references: [id])
}
```

## API Endpoints

### POST /payroll
**Create Payroll Record**
- **Access**: SUPER, HR
- **Description**: Creates new payroll record with automatic overtime calculation
- **Body**: CreatePayrollDto
```json
{
  "employeeId": "1",
  "periodStart": "2024-01-01T00:00:00Z",
  "periodEnd": "2024-01-31T23:59:59Z",
  "deductions": "100.00",
  "bonuses": "500.00",
  "overtimeRequestIds": ["1", "2", "3"]
}
```

### GET /payroll
**Get Payroll Records**
- **Access**: SUPER, HR, MANAGER
- **Description**: Retrieve paginated payroll records with filtering
- **Query Parameters**:
  - `employeeId`: Filter by employee
  - `department`: Filter by department
  - `status`: PENDING/PROCESSED/PAID
  - `periodStartFrom/To`: Date range filters
  - `page`, `limit`: Pagination

### GET /payroll/my
**Get Own Payroll Records**
- **Access**: EMPLOYEE, MANAGER
- **Description**: Retrieve payroll records for authenticated user

### GET /payroll/summary
**Get Payroll Summary**
- **Access**: SUPER, HR
- **Description**: Aggregated payroll statistics
- **Response**:
```json
{
  "totalPayrolls": 25,
  "totalBaseSalary": "125000000.00",
  "totalOvertimePay": "15000000.00",
  "totalDeductions": "5000000.00",
  "totalBonuses": "10000000.00",
  "totalGrossSalary": "145000000.00",
  "totalNetSalary": "140000000.00",
  "totalOvertimeHours": "250.5",
  "totalRegularHours": "4200.0"
}
```

### GET /payroll/:id
**Get Payroll by ID**
- **Access**: SUPER, HR, MANAGER, EMPLOYEE (own only)
- **Description**: Retrieve specific payroll record

### PUT /payroll/process
**Process Payroll Records**
- **Access**: SUPER, HR
- **Description**: Mark multiple payrolls as processed
- **Body**:
```json
{
  "payrollIds": ["1", "2", "3"]
}
```

### PUT /payroll/:id/mark-paid
**Mark Payroll as Paid**
- **Access**: SUPER, HR
- **Description**: Mark processed payroll as paid

### DELETE /payroll/:id
**Delete Payroll**
- **Access**: SUPER, HR
- **Description**: Delete unpaid payroll record

## Calculation Logic

### Base Salary
- Retrieved from current active salary record
- Uses SalaryService.getCurrentSalary()

### Overtime Pay Calculation
1. **Get Overtime Settings**: Rate multipliers from SettingsService
2. **Filter Approved Requests**: Only APPROVED status overtime requests
3. **Calculate Hourly Rate**: Monthly salary ÷ 173.33 hours
4. **Apply Rate Multipliers**:
   - Determine day type (weekday/weekend/holiday)
   - Apply appropriate rate multiplier
   - Calculate: hourly_rate × hours × multiplier

### Salary Totals
- **Gross Salary**: Base Salary + Overtime Pay + Bonuses
- **Net Salary**: Gross Salary - Deductions

## Integration Points

### Dependencies
- **SalaryModule**: Current salary retrieval
- **OvertimeModule**: Approved overtime requests
- **SettingsModule**: Rate multipliers and configuration
- **AttendanceModule**: Regular hours calculation
- **EmployeeModule**: Employee information

### Service Integration
```typescript
// Example usage in PayrollService
const currentSalary = await this.salaryService.getCurrentSalary(employeeId);
const overtimeSettings = await this.settingsService.getOvertimeSettings();
const overtimeRequests = await this.overtimeRequestService.findAll({
  employeeId,
  status: OvertimeStatus.APPROVED,
  dateFrom: periodStart.toISOString(),
  dateTo: periodEnd.toISOString(),
}, employeeId);
```

## Status Workflow

### Payroll States
1. **PENDING**: Created but not processed (`processedAt` is null, `isPaid` is false)
2. **PROCESSED**: Processed but not paid (`processedAt` not null, `isPaid` is false)
3. **PAID**: Fully completed (`isPaid` is true)

### State Transitions
- PENDING → PROCESSED: Use `/payroll/process` endpoint
- PROCESSED → PAID: Use `/payroll/:id/mark-paid` endpoint
- PAID payrolls cannot be deleted or modified

## Validation Rules

### Business Rules
- No overlapping payroll periods for same employee
- Employee must have active salary record
- Only SUPER/HR can create/modify payrolls
- Employees can only view their own payroll records
- Cannot delete paid payrolls
- Must be processed before marking as paid

### Data Validation
- Required fields: employeeId, periodStart, periodEnd
- Decimal precision: 2 decimal places for monetary amounts
- Date validation: periodEnd must be after periodStart
- BigInt handling: All IDs properly converted to/from strings

## Error Handling

### Common Errors
- **400**: Overlapping payroll periods, invalid data
- **403**: Insufficient permissions
- **404**: Payroll/Employee not found
- **409**: Business rule violations

### Error Examples
```json
{
  "statusCode": 400,
  "message": "Payroll already exists for this employee in the overlapping period"
}
```

## Performance Considerations

### Database Indexes
- `payrolls_processedBy_idx`: For processor queries
- `payrolls_isPaid_idx`: For status filtering
- `payrolls_periodStart_idx`: For period filtering
- `payrolls_periodEnd_idx`: For period range queries

### Optimization
- Pagination for large datasets
- Selective field loading with Prisma select
- Batch processing for multiple payroll updates
- Async calculation for overtime pay

## Security

### Access Control
- Role-based endpoint access
- Employee data isolation (employees see only their records)
- Audit trail with processedBy tracking
- Secure BigInt ID handling

### Data Protection
- Sensitive salary data restricted by role
- Processing history maintained
- Soft delete considerations for audit compliance

## Usage Examples

### Create Monthly Payroll
```typescript
const payroll = await payrollService.createPayroll({
  employeeId: '123',
  periodStart: '2024-01-01T00:00:00Z',
  periodEnd: '2024-01-31T23:59:59Z',
  bonuses: '500000.00',
  overtimeRequestIds: ['1', '2']
}, userId);
```

### Process Multiple Payrolls
```typescript
const result = await payrollService.processPayrolls({
  payrollIds: ['1', '2', '3']
}, userId);
// Returns: { processed: 2, failed: ['Payroll 3: Already processed'] }
```

### Get Department Summary
```typescript
const summary = await payrollService.getPayrollSummary();
// Returns aggregated statistics for all employees
```

## Migration Notes

### Database Updates
- Run `manual_payroll_overtime_update.sql` to add overtime fields
- Existing payroll records will have default overtime values
- Foreign key constraints added for data integrity

### Backward Compatibility
- Existing payroll records remain functional
- New fields have sensible defaults
- API maintains consistent response format