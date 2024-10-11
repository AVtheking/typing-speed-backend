"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = void 0;
const getConfig = () => {
    const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    const jwtResetSecret = process.env.JWT_RESET_SECRET;
    const jwtAdminSecret = process.env.JWT_ADMIN_SECRET;
    const SMTP_HOST = process.env.SMTP_HOST;
    const EMAIL = process.env.EMAIL;
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
    const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
    const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    const AWS_REGION = process.env.AWS_REGION;
    const AWS_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
    return {
        jwtAccessSecret,
        jwtRefreshSecret,
        jwtResetSecret,
        jwtAdminSecret,
        SMTP_HOST,
        EMAIL,
        EMAIL_PASSWORD,
        AWS_ACCESS_KEY,
        AWS_SECRET_KEY,
        AWS_REGION,
        AWS_BUCKET_NAME,
    };
};
exports.Env = getConfig();
//# sourceMappingURL=config.js.map