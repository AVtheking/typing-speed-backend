import { Exclude, Expose } from 'class-transformer';

export class AdminUserDto {
  @Expose()
  email: string;

  @Expose()
  id: number;

  @Exclude()
  password: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class AdminLoginDto {
  @Expose()
  admin: AdminUserDto;

  @Expose()
  accessToken: string;
}
