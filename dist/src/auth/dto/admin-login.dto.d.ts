export declare class AdminUserDto {
    email: string;
    id: number;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AdminLoginDto {
    admin: AdminUserDto;
    accessToken: string;
}
