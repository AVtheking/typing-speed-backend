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
exports.Mailer = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const config_1 = require("../../src/config");
let Mailer = class Mailer {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    sendMail(email, subject, html) {
        console.log('\x1b[33mSending mail to: \x1b[1m', email);
        this.mailerService.sendMail({
            from: config_1.Env.EMAIL,
            to: email,
            subject: subject,
            html: html,
        });
    }
    async sendEmailVerificationMail(email, otp) {
        const emailSubject = 'Email Verification OTP';
        const html = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f4f4f4; border-radius: 5px;">
                  <h2 style="color: #333;">Email Verification OTP</h2>
                  <p>Please use the following OTP to verify your email:</p>
                  <div style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</div>
                  <p>If you didn't request this OTP, please ignore this email.</p>
                  <p>Thank you!</p>
              </div>
          `;
        this.sendMail(email, emailSubject, html);
    }
    async sendForgetPasswordMail(email, otp) {
        const emailSubject = 'Reset Password Request';
        const html = `
            <p><b>Request to reset password is requested on this registered email.</b></p>
            <p>If it is not you, please ignore this and do not share OTP with anyone.</p>
            <div style="margin-top: 20px; text-align: center; font-size: 24px; color: blue;">
              <b>Your OTP:</b> ${otp}
            </div>
          `;
        this.sendMail(email, emailSubject, html);
    }
};
exports.Mailer = Mailer;
exports.Mailer = Mailer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], Mailer);
//# sourceMappingURL=Mailer.js.map