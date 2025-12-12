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
exports.UploadProfilePictureResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UploadProfilePictureResponseDto {
    url;
    filename;
    message;
}
exports.UploadProfilePictureResponseDto = UploadProfilePictureResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'http://localhost:3000/uploads/profiles/1702345678901-profile.jpg' }),
    __metadata("design:type", String)
], UploadProfilePictureResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1702345678901-profile.jpg' }),
    __metadata("design:type", String)
], UploadProfilePictureResponseDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Profile picture uploaded successfully' }),
    __metadata("design:type", String)
], UploadProfilePictureResponseDto.prototype, "message", void 0);
//# sourceMappingURL=upload-profile-picture.dto.js.map