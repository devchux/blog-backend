import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserSignUpDto } from './dto/userSignup.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  fetchUsers() {
    return this.userService.getAllUsers();
  }

  @Get('user')
  findUser(@Query('username') username: string) {
    return this.userService.getUserByUserName(username);
  }

  @Delete('admin-delete')
  deleteUserByEmail(@Body('email') email: string) {
    return this.userService.deleteUserByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  updateUser(@Param('id') id: number, @Body() updateCreds: UserSignUpDto) {
    return this.userService.updateUser(id, updateCreds);
  }

  @UseGuards(JwtAuthGuard)
  @Put('activate/:id')
  activateUser(@Param('id') id: number) {
    return this.userService.activateUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('deactivate/:id')
  deactivateUser(@Param('id') id: number) {
    return this.userService.deactivateUser(id);
  }

  @Post('upload-profile-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadProfileImage(file);
  }
}
