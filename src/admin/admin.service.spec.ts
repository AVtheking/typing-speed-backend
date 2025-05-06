import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app.module';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: PrismaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // providers: [AdminService, PrismaService],
      imports: [AppModule],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get<PrismaService>(PrismaService);
    await prisma.cleanDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an admin user', async () => {
    const data = {
      email: 'abc@gmail.com',
      password: 'Password@123',
    };
    const result = await service.createAdmin(data);
    expect(result).toHaveProperty('email', data.email);
  });

  it('should fail if the email is not proper', async () => {
    const data = {
      email: 'abc',
      password: 'Password@123',
    };

    try {
      await service.createAdmin(data);
    } catch (error) {
      expect(error.message).toBe('Invalid email');
    }
  });
});
