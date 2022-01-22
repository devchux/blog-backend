import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/resources/user/entities/user.entity';
import { UserService } from 'src/resources/user/user.service';
import { UserSignUpDto } from '../user/dto/userSignup.dto';
import { UserLogin } from './dto/userLogin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: UserLogin): Promise<User> {
    const user = await this.userService.getUserByEmail(email);
    const isValid = await user.validatePassword(password);

    if (!isValid) throw new ForbiddenException('Password is not correct');

    return user;
  }

  async register(userCreds: UserSignUpDto) {
    try {
      const user = this.userService.createUser(userCreds);
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(user: any) {
    const payload = { ...user, password: undefined };
    return {
      access_token: this.jwtService.sign({ ...payload }),
      user: payload,
    };
  }
}
