"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryModule = void 0;
const common_1 = require("@nestjs/common");
const salary_service_1 = require("./services/salary.service");
const salary_history_service_1 = require("./services/salary-history.service");
const salary_controller_1 = require("./controllers/salary.controller");
const salary_history_controller_1 = require("./controllers/salary-history.controller");
const salary_repository_1 = require("./repositories/salary.repository");
const salary_history_repository_1 = require("./repositories/salary-history.repository");
const employee_module_1 = require("../employee/employee.module");
let SalaryModule = class SalaryModule {
};
exports.SalaryModule = SalaryModule;
exports.SalaryModule = SalaryModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => employee_module_1.EmployeeModule)],
        controllers: [salary_controller_1.SalaryController, salary_history_controller_1.SalaryHistoryController],
        providers: [
            salary_service_1.SalaryService,
            salary_history_service_1.SalaryHistoryService,
            salary_repository_1.SalaryRepository,
            salary_history_repository_1.SalaryHistoryRepository,
        ],
        exports: [
            salary_service_1.SalaryService,
            salary_history_service_1.SalaryHistoryService,
            salary_repository_1.SalaryRepository,
            salary_history_repository_1.SalaryHistoryRepository,
        ],
    })
], SalaryModule);
//# sourceMappingURL=salary.module.js.map