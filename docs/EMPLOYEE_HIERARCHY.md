# Employee Hierarchy Management System

## Overview
Sistem hierarki employee yang fleksibel dengan hubungan parent-child tak terbatas menggunakan adjacency list pattern.

## Features Implemented

### 1. Database Schema
- Added `managerId` column to `employees` table
- Self-referential relationship: `Employee.manager` and `Employee.subordinates`
- Migration: `20251210075459_add_employee_hierarchy`

### 2. API Endpoints

#### Assign Subordinates (Parent adds Children)
```
POST /employees/{parentId}/subordinates
Body: {
  "subordinateIds": [123, 456, 789]
}
```

#### Set Manager (Child sets Parent)
```
PUT /employees/{childId}/manager
Body: {
  "managerId": 456  // or null to remove
}
```

#### Get Organization Tree
```
GET /employees/{employeeId}/organization-tree
Response: {
  "manager": { employee data },
  "employee": { current employee },
  "subordinates": [{ subordinate data }],
  "siblings": [{ sibling data }],
  "managementChain": [{ management chain to top }]
}
```

#### Get All Subordinates (Recursive)
```
GET /employees/{managerId}/subordinates
```

#### Get Management Chain
```
GET /employees/{employeeId}/management-chain
```

### 3. Validation Features
- ✅ Employee cannot be their own manager
- ✅ Circular dependency detection
- ✅ Manager and subordinate existence validation
- ✅ Soft-deleted employees are excluded from hierarchy

### 4. Enhanced Create/Update Employee
- Can assign manager during employee creation
- Can update manager through employee update endpoint

## Usage Examples

### Create Employee with Manager
```json
{
  "email": "john@company.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe", 
  "position": "Software Engineer",
  "department": "Engineering",
  "joinDate": "2024-01-01",
  "baseSalary": 75000,
  "managerId": 456
}
```

### Assign Multiple Subordinates
```json
{
  "subordinateIds": [123, 456, 789]
}
```

### Set Manager
```json
{
  "managerId": 456
}
```

## Permission Levels
- **SUPER/HR**: Full access to all hierarchy operations
- **EMPLOYEE**: Can view their own organization tree and management chain

## Error Handling
- 400: Circular dependency, invalid data
- 404: Employee/manager not found
- 403: Insufficient permissions

The system supports unlimited depth hierarchy and prevents circular references for data integrity.