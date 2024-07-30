import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { prismaMock } from '../mocks/mocks';
import { Otp } from '@prisma/client';

const mockOtp: Otp = {
  id: '1',
  email: 'test@example.com',
  otp: 123456,
  createdAt: new Date(),
};

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get otp', async () => {
    prismaMock.otp.findUnique.mockResolvedValue(mockOtp);
    const result = await service.getOtp(mockOtp.email);
    expect(result).toEqual(mockOtp);
  });

  it('should return null if no otp found', async () => {
    prismaMock.otp.findUnique.mockResolvedValue(null);
    const result = await service.getOtp('abc');
    expect(result).toBeNull();
  });

  it('should delete otp', async () => {
    await service.deleteOtp('abc');
    expect(prismaMock.otp.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.otp.delete).toHaveBeenCalledWith({
      where: {
        email: 'abc',
      },
    });
  });

  it('should return true if otp is not expirec', async () => {
    const result = service.checkExpiration(mockOtp);
    expect(result).toBe(true);
  });

  it('should return false if otp is expired', async () => {
    const otp = {
      ...mockOtp,
      createdAt: new Date(Date.now() - 70000),
    };
    const result = service.checkExpiration(otp);
    expect(result).toBe(false);
  });

  it('should generate and update an existing otp', async () => {
    prismaMock.otp.findFirst.mockResolvedValue(mockOtp);
    prismaMock.otp.update.mockResolvedValue(mockOtp);
    const result = await service.generateOtp(mockOtp.email);
    expect(result).toBeGreaterThan(100000);
    expect(result).toBeLessThanOrEqual(999999);
    expect(prismaMock.otp.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.otp.update).toHaveBeenCalledWith({
      where: { id: mockOtp.id },
      data: { otp: result },
    });
  });
  it('should generate and create a new OTP', async () => {
    prismaMock.otp.findFirst.mockResolvedValue(null);
    prismaMock.otp.create.mockResolvedValue(mockOtp);

    const result = await service.generateOtp('test@example.com');
    expect(result).toBeGreaterThanOrEqual(100000);
    expect(result).toBeLessThanOrEqual(999999);
    expect(prismaMock.otp.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        otp: result,
      },
    });
  });
});
