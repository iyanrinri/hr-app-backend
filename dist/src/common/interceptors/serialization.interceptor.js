"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializationInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let SerializationInterceptor = class SerializationInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            const jsonString = JSON.stringify(data, (key, value) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                if (value instanceof Date) {
                    return value.toISOString();
                }
                if (value && typeof value === 'object' &&
                    typeof value.s === 'number' &&
                    typeof value.e === 'number' &&
                    Array.isArray(value.d)) {
                    return parseFloat(value.toString());
                }
                return value;
            });
            return JSON.parse(jsonString);
        }));
    }
};
exports.SerializationInterceptor = SerializationInterceptor;
exports.SerializationInterceptor = SerializationInterceptor = __decorate([
    (0, common_1.Injectable)()
], SerializationInterceptor);
//# sourceMappingURL=serialization.interceptor.js.map