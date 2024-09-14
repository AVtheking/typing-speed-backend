import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards';
import { Response } from 'express';
import { ChangeEmailDto } from './dto/change-email.dto';

@Controller('user')
@ApiTags('User')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUser(@Req() req: any, @Res() res: Response) {
    const userId = req.user;
    return this.userService.getUserById(userId, res);
  }

  // @Put('/edit')
  // async editUser(@Req() req: any, @Res() res: Response) {
  //   // const userId = req.user;
  //   // return this.userService.editUser(userId, req.body, res);
  // }

  @Put('/change-email')
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
}
