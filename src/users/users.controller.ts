import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards';
import { Response } from 'express';
import { ChangeEmailDto } from './dto/change-email.dto';
import { SaveTestResultDto } from './dto/save-test-result.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('user')
@ApiTags('User')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get user details',
    description: 'Retrieve user details by user ID from the JWT token.',
  })
  async getUser(@Req() req: any, @Res() res: Response) {
    const userId = req.user;
    return this.userService.getUserById(userId, res);
  }

  @Patch('/change-email')
  @ApiOperation({
    summary: 'Change user email',
    description: 'Allows a user to change their email address.',
  })
  @ApiBody({ type: ChangeEmailDto })
  async changeEmail(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: ChangeEmailDto,
  ) {
    const userId = req.user;
    const { email } = body;
    return this.userService.changeEmail(userId, email, res);
  }

  @Patch('/change-password')
  @ApiOperation({
    summary: 'Change user password',
    description: 'Allows a user to change their password.',
  })
  async changePassword(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: { password: string },
  ) {
    const userId = req.user;
    const { password } = body;
    return this.userService.changePassword(userId, password, res);
  }

  @UseGuards(AuthGuard)
  @Post('/verify-email')
  @ApiOperation({
    summary: 'Verify email address',
    description:
      'Verifies the OTP for email and updates the email verification status.',
  })
  @ApiBody({ type: VerifyOtpDto })
  async verifyEmail(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: VerifyOtpDto,
  ) {
    const userId = req.user;
    return this.userService.verifyEmail(body, userId, res);
  }

  @UseGuards(AuthGuard)
  @Post('/test')
  @ApiOperation({
    summary: 'Save test result',
    description: 'Saves the test result for the logged-in user.',
  })
  @ApiBody({ type: SaveTestResultDto })
  async saveTest(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: SaveTestResultDto,
  ) {
    const userId = req.user;
    return this.userService.saveTestResult(userId, body, res);
  }

  @Patch('/profile-image')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({
    summary: 'Update profile image',
    description:
      'Updates the profile image for the logged-in user. Only JPEG, JPG, and PNG formats are allowed, with a maximum size of 2MB.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileImage: {
          type: 'string',
          format: 'binary',
          description: 'Uploaded profile image',
        },
      },
    },
  })
  async updateProfileImage(
    @Req() req: any,
    @Res() res: Response,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: new RegExp('^image/(jpeg|jpg|png)$'),
        })
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 }) // Changed to 2MB
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    const userId = req.user;
    if (file) {
      return this.userService.uploadProfileImage(file, userId, res);
    }
  }
}
