import { MailerService } from '@nestjs-modules/mailer';
export declare class Mailer {
    private mailerService;
    constructor(mailerService: MailerService);
    sendMail(email: string, subject: string, html: string): void;
    sendEmailVerificationMail(email: string, otp: number): Promise<void>;
    sendForgetPasswordMail(email: string, otp: number): Promise<void>;
}
