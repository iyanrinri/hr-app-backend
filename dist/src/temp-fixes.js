"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOvertimeSettings = exports.OvertimeStatus = void 0;
var OvertimeStatus;
(function (OvertimeStatus) {
    OvertimeStatus["PENDING"] = "PENDING";
    OvertimeStatus["APPROVED"] = "APPROVED";
    OvertimeStatus["REJECTED"] = "REJECTED";
})(OvertimeStatus || (exports.OvertimeStatus = OvertimeStatus = {}));
const getOvertimeSettings = () => ({
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
exports.getOvertimeSettings = getOvertimeSettings;
//# sourceMappingURL=temp-fixes.js.map