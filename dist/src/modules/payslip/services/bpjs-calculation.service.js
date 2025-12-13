"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BPJSCalculationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const client_1 = require("@prisma/client");
let BPJSCalculationService = class BPJSCalculationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateBPJS(monthlyGrossSalary, jkkRiskCategory = 'LOW') {
        const config = await this.getBPJSConfig();
        const kesehatanBaseSalary = Math.min(monthlyGrossSalary, config.kesehatanMaxSalary);
        const bpjsKesehatanEmployee = Math.round(kesehatanBaseSalary * config.kesehatanEmployeeRate);
        const bpjsKesehatanCompany = Math.round(kesehatanBaseSalary * config.kesehatanCompanyRate);
        const bpjsKesehatanTotal = bpjsKesehatanEmployee + bpjsKesehatanCompany;
        const jhtEmployee = Math.round(monthlyGrossSalary * config.jhtEmployeeRate);
        const jhtCompany = Math.round(monthlyGrossSalary * config.jhtCompanyRate);
        const jpBaseSalary = Math.min(monthlyGrossSalary, config.jpMaxSalary);
        const jpEmployee = Math.round(jpBaseSalary * config.jpEmployeeRate);
        const jpCompany = Math.round(jpBaseSalary * config.jpCompanyRate);
        const jkkCompany = Math.round(monthlyGrossSalary * config.jkkRate);
        const jkmCompany = Math.round(monthlyGrossSalary * config.jkmCompanyRate);
        const bpjsKetenagakerjaanEmployee = jhtEmployee + jpEmployee;
        const bpjsKetenagakerjaanCompany = jhtCompany + jpCompany + jkkCompany + jkmCompany;
        const bpjsKetenagakerjaanTotal = bpjsKetenagakerjaanEmployee + bpjsKetenagakerjaanCompany;
        const totalEmployeeDeduction = bpjsKesehatanEmployee + bpjsKetenagakerjaanEmployee;
        const totalCompanyContribution = bpjsKesehatanCompany + bpjsKetenagakerjaanCompany;
        const totalBPJS = totalEmployeeDeduction + totalCompanyContribution;
        return {
            bpjsKesehatanEmployee,
            bpjsKesehatanCompany,
            bpjsKesehatanTotal,
            jhtEmployee,
            jhtCompany,
            jpEmployee,
            jpCompany,
            jkkCompany,
            jkmCompany,
            bpjsKetenagakerjaanEmployee,
            bpjsKetenagakerjaanCompany,
            bpjsKetenagakerjaanTotal,
            totalEmployeeDeduction,
            totalCompanyContribution,
            totalBPJS,
            grossSalaryUsed: monthlyGrossSalary,
            kesehatanMaxSalaryCap: config.kesehatanMaxSalary,
            jpMaxSalaryCap: config.jpMaxSalary,
            jkkRiskCategory,
        };
    }
    async getBPJSConfig() {
        const settings = await this.prisma.setting.findMany({
            where: {
                OR: [
                    { category: client_1.SettingCategory.BPJS_KESEHATAN },
                    { category: client_1.SettingCategory.BPJS_KETENAGAKERJAAN },
                ],
            },
        });
        const config = {};
        settings.forEach((setting) => {
            switch (setting.key) {
                case 'BPJS_KESEHATAN_EMPLOYEE_RATE':
                    config.kesehatanEmployeeRate = parseFloat(setting.value);
                    break;
                case 'BPJS_KESEHATAN_COMPANY_RATE':
                    config.kesehatanCompanyRate = parseFloat(setting.value);
                    break;
                case 'BPJS_KESEHATAN_MAX_SALARY':
                    config.kesehatanMaxSalary = parseFloat(setting.value);
                    break;
                case 'BPJS_TK_JHT_EMPLOYEE_RATE':
                    config.jhtEmployeeRate = parseFloat(setting.value);
                    break;
                case 'BPJS_TK_JHT_COMPANY_RATE':
                    config.jhtCompanyRate = parseFloat(setting.value);
                    break;
                case 'BPJS_TK_JP_EMPLOYEE_RATE':
                    config.jpEmployeeRate = parseFloat(setting.value);
                    break;
                case 'BPJS_TK_JP_COMPANY_RATE':
                    config.jpCompanyRate = parseFloat(setting.value);
                    break;
                case 'BPJS_TK_JP_MAX_SALARY':
                    config.jpMaxSalary = parseFloat(setting.value);
                    break;
                case 'BPJS_TK_JKK_DEFAULT_RATE':
                    config.jkkRate = parseFloat(setting.value);
                    break;
                case 'BPJS_TK_JKM_COMPANY_RATE':
                    config.jkmCompanyRate = parseFloat(setting.value);
                    break;
            }
        });
        return config;
    }
    async getJKKRate(riskCategory) {
        const keyMap = {
            LOW: 'BPJS_TK_JKK_RATE_LOW',
            MEDIUM_LOW: 'BPJS_TK_JKK_RATE_MEDIUM_LOW',
            MEDIUM: 'BPJS_TK_JKK_RATE_MEDIUM',
            MEDIUM_HIGH: 'BPJS_TK_JKK_RATE_MEDIUM_HIGH',
            HIGH: 'BPJS_TK_JKK_RATE_HIGH',
        };
        const setting = await this.prisma.setting.findUnique({
            where: { key: keyMap[riskCategory] },
        });
        return setting ? parseFloat(setting.value) : 0.0024;
    }
};
exports.BPJSCalculationService = BPJSCalculationService;
exports.BPJSCalculationService = BPJSCalculationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BPJSCalculationService);
//# sourceMappingURL=bpjs-calculation.service.js.map