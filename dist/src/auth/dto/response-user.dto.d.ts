export declare class UserDto {
    username: string;
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ResponseUserDto {
    user: UserDto;
    accessToken: string;
    refreshToken: string;
}
