"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvertimeModule = void 0;
const common_1 = require("@nestjs/common");
const overtime_request_service_1 = require("./services/overtime-request.service");
const overtime_approval_service_1 = require("./services/overtime-approval.service");
const overtime_request_controller_1 = require("./controllers/overtime-request.controller");
const overtime_approval_controller_1 = require("./controllers/overtime-approval.controller");
const overtime_request_repository_1 = require("./repositories/overtime-request.repository");
const overtime_approval_repository_1 = require("./repositories/overtime-approval.repository");
let OvertimeModule = class OvertimeModule {
};
exports.OvertimeModule = OvertimeModule;
exports.OvertimeModule = OvertimeModule = __decorate([
    (0, common_1.Module)({
        controllers: [overtime_request_controller_1.OvertimeRequestController, overtime_approval_controller_1.OvertimeApprovalController],
        providers: [
            overtime_request_service_1.OvertimeRequestService,
            overtime_approval_service_1.OvertimeApprovalService,
            overtime_request_repository_1.OvertimeRequestRepository,
            overtime_approval_repository_1.OvertimeApprovalRepository,
        ],
        exports: [
            overtime_request_service_1.OvertimeRequestService,
            overtime_approval_service_1.OvertimeApprovalService,
            overtime_request_repository_1.OvertimeRequestRepository,
            overtime_approval_repository_1.OvertimeApprovalRepository,
        ],
    })
], OvertimeModule);
//# sourceMappingURL=overtime.module.js.map