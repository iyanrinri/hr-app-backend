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
exports.SettingsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let SettingsRepository = class SettingsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.setting.create({
            data: {
                ...data,
                dataType: data.dataType,
                category: data.category,
            },
        });
    }
    async findByKey(key) {
        return this.prisma.setting.findUnique({
            where: { key },
        });
    }
    async update(key, data) {
        return this.prisma.setting.update({
            where: { key },
            data: {
                ...data,
                dataType: data.dataType ? data.dataType : undefined,
                category: data.category ? data.category : undefined,
            },
        });
    }
    async delete(key) {
        return this.prisma.setting.delete({
            where: { key },
        });
    }
    async findAll(filter) {
        const { page = 1, limit = 10, category, isPublic, searchTerm, } = filter;
        const skip = (page - 1) * limit;
        const take = limit;
        const where = {};
        if (category) {
            where.category = category;
        }
        if (isPublic !== undefined) {
            where.isPublic = isPublic;
        }
        if (searchTerm) {
            where.OR = [
                { key: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }
        return this.prisma.setting.findMany({
            where,
            skip,
            take,
            orderBy: [
                { category: 'asc' },
                { key: 'asc' },
            ],
        });
    }
    async count(filter) {
        const { category, isPublic, searchTerm, } = filter;
        const where = {};
        if (category) {
            where.category = category;
        }
        if (isPublic !== undefined) {
            where.isPublic = isPublic;
        }
        if (searchTerm) {
            where.OR = [
                { key: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }
        return this.prisma.setting.count({ where });
    }
    async getByCategory(category) {
        return this.prisma.setting.findMany({
            where: { category: category },
            orderBy: { key: 'asc' },
        });
    }
    async getPublicSettings() {
        return this.prisma.setting.findMany({
            where: { isPublic: true },
            select: {
                key: true,
                value: true,
                category: true,
                description: true,
                dataType: true,
            },
            orderBy: [
                { category: 'asc' },
                { key: 'asc' },
            ],
        });
    }
    async createMany(settings) {
        const data = settings.map(setting => ({
            ...setting,
            dataType: setting.dataType,
            category: setting.category,
        }));
        return this.prisma.setting.createMany({
            data,
            skipDuplicates: true,
        });
    }
};
exports.SettingsRepository = SettingsRepository;
exports.SettingsRepository = SettingsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsRepository);
//# sourceMappingURL=settings.repository.js.map