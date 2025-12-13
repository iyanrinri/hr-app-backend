"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayslipModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const payslip_service_1 = require("./services/payslip.service");
const tax_calculation_service_1 = require("./services/tax-calculation.service");
const bpjs_calculation_service_1 = require("./services/bpjs-calculation.service");
const payslip_controller_1 = require("./controllers/payslip.controller");
const payslip_repository_1 = require("./repositories/payslip.repository");
let PayslipModule = class PayslipModule {
};
exports.PayslipModule = PayslipModule;
exports.PayslipModule = PayslipModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        providers: [
            payslip_service_1.PayslipService,
            tax_calculation_service_1.TaxCalculationService,
            bpjs_calculation_service_1.BPJSCalculationService,
            payslip_repository_1.PayslipRepository,
        ],
        controllers: [payslip_controller_1.PayslipController],
        exports: [payslip_service_1.PayslipService, tax_calculation_service_1.TaxCalculationService, bpjs_calculation_service_1.BPJSCalculationService],
    })
], PayslipModule);
//# sourceMappingURL=payslip.module.js.map