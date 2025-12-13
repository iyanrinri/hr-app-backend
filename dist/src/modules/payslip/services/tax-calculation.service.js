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
exports.TaxCalculationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const client_1 = require("@prisma/client");
let TaxCalculationService = class TaxCalculationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculatePPh21(monthlyGrossSalary, maritalStatus, dependents = 0) {
        const ptkpConfig = await this.getPTKPConfig();
        const taxBrackets = await this.getTaxBrackets();
        const annualGrossSalary = monthlyGrossSalary * 12;
        const ptkpCategory = this.determinePTKPCategory(maritalStatus, dependents);
        const ptkp = this.getPTKP(ptkpConfig, maritalStatus, dependents);
        const taxableIncome = Math.max(0, annualGrossSalary - ptkp);
        const { annualTax, taxDetails } = this.calculateProgressiveTax(taxableIncome, taxBrackets);
        const monthlyTax = Math.round(annualTax / 12);
        return {
            annualGrossSalary,
            ptkp,
            taxableIncome,
            annualTax,
            monthlyTax,
            taxDetails,
            ptkpCategory,
        };
    }
    async getPTKPConfig() {
        const ptkpSettings = await this.prisma.setting.findMany({
            where: {
                category: client_1.SettingCategory.TAX_PPH21,
                key: {
                    startsWith: 'TAX_PTKP_',
                },
            },
        });
        const config = {};
        ptkpSettings.forEach((setting) => {
            const key = setting.key.replace('TAX_PTKP_', '');
            config[key] = parseFloat(setting.value);
        });
        return config;
    }
    async getTaxBrackets() {
        const bracketSettings = await this.prisma.setting.findMany({
            where: {
                category: client_1.SettingCategory.TAX_PPH21,
                key: {
                    startsWith: 'TAX_BRACKET_',
                },
            },
            orderBy: {
                key: 'asc',
            },
        });
        const brackets = [];
        const limits = {};
        const rates = {};
        bracketSettings.forEach((setting) => {
            const match = setting.key.match(/TAX_BRACKET_(\d+)_(LIMIT|RATE)/);
            if (match) {
                const bracketNum = parseInt(match[1]);
                const type = match[2];
                if (type === 'LIMIT') {
                    limits[bracketNum] = parseFloat(setting.value);
                }
                else if (type === 'RATE') {
                    rates[bracketNum] = parseFloat(setting.value);
                }
            }
        });
        const maxBracket = Math.max(...Object.keys(limits).map(Number));
        for (let i = 1; i <= maxBracket; i++) {
            brackets.push({
                limit: limits[i] || null,
                rate: rates[i] || 0,
            });
        }
        if (rates[maxBracket + 1]) {
            brackets.push({
                limit: null,
                rate: rates[maxBracket + 1],
            });
        }
        return brackets;
    }
    determinePTKPCategory(maritalStatus, dependents) {
        const status = maritalStatus === 'MARRIED' ? 'K' : 'TK';
        const deps = Math.min(dependents, 3);
        return `${status}/${deps}`;
    }
    getPTKP(config, maritalStatus, dependents) {
        const status = maritalStatus === 'MARRIED' ? 'K' : 'TK';
        const deps = Math.min(dependents, 3);
        const key = `${status}_${deps}`;
        return config[key] || config.TK_0;
    }
    calculateProgressiveTax(taxableIncome, brackets) {
        let remainingIncome = taxableIncome;
        let totalTax = 0;
        const taxDetails = [];
        let previousLimit = 0;
        for (let i = 0; i < brackets.length; i++) {
            const bracket = brackets[i];
            const bracketLimit = bracket.limit || Infinity;
            const bracketRange = bracketLimit - previousLimit;
            const incomeInBracket = Math.min(remainingIncome, bracketRange);
            if (incomeInBracket <= 0)
                break;
            const taxInBracket = incomeInBracket * bracket.rate;
            totalTax += taxInBracket;
            taxDetails.push({
                bracket: i + 1,
                income: incomeInBracket,
                rate: bracket.rate,
                tax: taxInBracket,
            });
            remainingIncome -= incomeInBracket;
            previousLimit = bracketLimit;
            if (remainingIncome <= 0)
                break;
        }
        return {
            annualTax: Math.round(totalTax),
            taxDetails,
        };
    }
    async calculateTaxForEmployee(employeeId, monthlyGrossSalary) {
        const employee = await this.prisma.employee.findUnique({
            where: { id: employeeId },
        });
        if (!employee) {
            throw new Error('Employee not found');
        }
        let maritalStatus = null;
        if (employee.maritalStatus === 'SINGLE') {
            maritalStatus = 'SINGLE';
        }
        else if (employee.maritalStatus === 'MARRIED') {
            maritalStatus = 'MARRIED';
        }
        const dependents = 0;
        return this.calculatePPh21(monthlyGrossSalary, maritalStatus, dependents);
    }
};
exports.TaxCalculationService = TaxCalculationService;
exports.TaxCalculationService = TaxCalculationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TaxCalculationService);
//# sourceMappingURL=tax-calculation.service.js.map