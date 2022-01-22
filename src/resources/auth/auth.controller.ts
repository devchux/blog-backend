import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  UsePipes,
} from '@nestjs/common';
import { UserSignUpDto } from '../user/dto/userSignup.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ValidationPipe } from '../user/pipes/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() credentials: UserSignUpDto) {
    return this.authService.register(credentials);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
