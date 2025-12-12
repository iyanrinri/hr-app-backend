"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxFileSize = exports.imageFileFilter = exports.profilePictureStorage = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
exports.profilePictureStorage = (0, multer_1.diskStorage)({
    destination: './uploads/profiles',
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = (0, path_1.extname)(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
    },
});
const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new common_1.BadRequestException('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
    }
    callback(null, true);
};
exports.imageFileFilter = imageFileFilter;
exports.maxFileSize = 5 * 1024 * 1024;
//# sourceMappingURL=file-upload.util.js.map